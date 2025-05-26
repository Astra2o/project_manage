import { NextResponse } from 'next/server';
import connectDB from '@/backend/models/db';
import taskModel from '@/backend/models/taskModel';
import { authenticate } from '@/backend/middleware/auth';

export async function POST(req, { params }) {
  try {
    // 1️⃣ Connect to MongoDB
    await connectDB();

    // 2️⃣ Authenticate user
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const user = authenticate(token);
    if (!user) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 403 });
    }

    // 3️⃣ Validate request body
    const body = await req.json();
    const commentText = body.comment?.trim();
    if (!commentText) {
      return NextResponse.json({ message: 'Comment text is required' }, { status: 400 });
    }

    const { task_id } = params;

    // 4️⃣ Find the task and push new comment
    const task = await taskModel.findById(task_id);
    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    // 5️⃣ Only allow comment if user is assigned or manager, etc. (optional)
    // For now we allow any authenticated user to comment:
    task.taskComments.push({
      comment: commentText,
      commentBy: user.id,
      commentAt: new Date(),
    });

    await task.save();

    // 6️⃣ Populate the newly added commentBy field
    await task.populate({
      path: 'taskComments.commentBy',
      select: '_id name role'
    });

    // 7️⃣ Return updated task
    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { message: 'Something went wrong while adding comment', error: error.message },
      { status: 500 }
    );
  }
}
