import { NextResponse } from 'next/server';
import db from '@/lib/database'; // Import your database instance
import { userTable, userDataTable } from '@/lib/database/schema'; // Import your database schema
const { v4: uuidv4 } = require("uuid");
import * as argon2 from "argon2"
import { getUsers } from "@/actions/user.actions";

// CREATE (POST) - Add a new user
export async function POST(request: Request) {
  const body = await request.json();
  const { username, password, domainId, firstname, lastname, email, phone, role } = body;

  try {
    // Step 1: Start a transaction with an explicit type
    await db.transaction(async (trx) => {
      // Step 2: Hash the password
      const hashedPassword = await argon2.hash(password);

      // Step 3: Create entry in 'users' table within the transaction
      const newUser = await trx
        .insert(userTable)
        .values({
          id: uuidv4(),
          username: username,
          hashedPassword,
          domainId: domainId,
        })
        .returning({
          id: userTable.id,
        });

      if (!newUser.length) {
        throw new Error('Failed to create user');
      }

      const userId = newUser[0].id;

      // Step 4: Use the userId to create an entry in 'userData' table within the transaction
      const newUserData = await trx.insert(userDataTable).values({
        id: uuidv4(),
        userId: userId,
        firstname: firstname,
        lastname: lastname,
        email: email,
        phone: phone,
        role: role,
        status: 'not-activated',
      });

      if (!newUser || newUser.length === 0) {
        throw new Error('Failed to create user additional data');
      }

      // Step 5: Commit happens automatically when the function scope finishes successfully.
    });

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    // If any error occurs, the transaction will automatically be rolled back.
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

// READ (GET) - Get a list of users or a specific user
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('id');

  try {
    if (userId) {
      // Get a single user

      // const user = await db.select().from('users').where('id', userId).first();
      // return NextResponse.json(user, { status: 200 });
    } else {
      // Get all users
      const users = await getUsers();
      return NextResponse.json(users, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve users' }, { status: 500 });
  }
}

// // UPDATE (PUT) - Update a user by ID
// export async function PUT(request: Request) {
//   const body = await request.json();
//   const { id, name, email, role } = body;

//   try {
//     const updatedUser = await db.update('users').set({
//       name,
//       email,
//       role,
//     }).where('id', id);

//     return NextResponse.json(updatedUser, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
//   }
// }

// // DELETE (DELETE) - Remove a user by ID
// export async function DELETE(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const userId = searchParams.get('id');

//   if (!userId) {
//     return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
//   }

//   try {
//     await db.delete('users').where('id', userId);
//     return NextResponse.json({ message: 'User deleted' }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
//   }
// }
