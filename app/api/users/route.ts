import { NextResponse } from 'next/server';
import db from '@/lib/database'; // Import your database instance
import { userTable, userDataTable } from '@/lib/database/schema'; // Import your database schema
const { v4: uuidv4 } = require("uuid");
import * as argon2 from "argon2"

interface User {
  id: string;
  firstname: string
  lastname: string
  email: string
  username: string
  phone: string
  role: string
  status: string
}

// CREATE (POST) - Add a new user
export async function POST(request: Request) {
  const body = await request.json();
  const { username, password, domainId, firstname, lastname, email, phone, role } = body;

  try {
    // Step 1: Create entry in 'users' table
    const hashedPassword = await argon2.hash(password)

    const newUser = await db.insert(userTable)
      .values({
        id: uuidv4(),
        username: username,
        hashedPassword,
        domainId: domainId,
      })
      .returning({
        id: userTable.id,
      })

    if (!newUser.length) {
      throw new Error('Failed to create user');
    }

    const userId = newUser[0].id;

    // Step 2: Use the userId to create an entry in 'userData' table
    const newUserData = await db.insert(userDataTable).values({
      id: uuidv4(),
      userId: userId,    
      firstname: firstname,
      lastname: lastname,
      email: email,
      phone: phone,
      role: role,
      status: 'not-activated'
    });

    if (!newUser.length) {
      throw new Error('Failed to create user additional data');
    }

    return NextResponse.json({ user: newUser, userData: newUserData }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

// // READ (GET) - Get a list of users or a specific user
// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const userId = searchParams.get('id');

//   try {
//     if (userId) {
//       // Get a single user
//       const user = await db.select().from('users').where('id', userId).first();
//       return NextResponse.json(user, { status: 200 });
//     } else {
//       // Get all users
//       const users = await db.select().from('users').all();
//       return NextResponse.json(users, { status: 200 });
//     }
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to retrieve users' }, { status: 500 });
//   }
// }

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
