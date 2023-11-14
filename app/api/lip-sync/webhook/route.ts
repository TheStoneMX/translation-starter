import { Status } from '@/types_db';
import { NextApiRequest } from 'next';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return NextResponse.json({ success: false, message: `Method not allowed` });
  }

  console.log('req: ', req);

  const { result } = await req.json();

  console.log('result: ', result);

  try {
    console.log('in sync labs webhook');

    const updateJobResponse = await fetch(
      'http://localhost:3000/api/db/update-job-by-original-video-url',
      {
        method: 'POST',
        body: JSON.stringify({
          originalVideoUrl: result.originalVideoUrl,
          updatedFields: {
            video_url: result.url,
            status: 'completed' as Status
          }
        })
      }
    );

    if (!updateJobResponse.ok) {
      console.error(
        `Failed to update job status: ${updateJobResponse.status} ${updateJobResponse.statusText}`
      );
      return NextResponse.json({
        success: false,
        message: `Failed to update job status: ${updateJobResponse.status} ${updateJobResponse.statusText}`
      });
    }

    const jobData = await updateJobResponse.json();

    console.log('webhook - jobData: ', jobData);

    return NextResponse.json({ success: true, data: jobData });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      success: false,
      message: `Error creating job`,
      error
    });
  }
}