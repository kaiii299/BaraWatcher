import { NextResponse } from "next/server";
import { createValidationRequest, getValidationRequests } from "@/app/actions/validationRequest";
import { ValidationRequestStatus, ValidationRequestType } from "@prisma/client";

export async function GET() {
  try {
    const validationRequests = await getValidationRequests();
    return NextResponse.json(validationRequests, { status: 200 });
  } catch (error) {
    console.error("Error fetching validation requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch validation requests" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    if (!body.type || !body.content) {
      return NextResponse.json(
        { error: "Missing required fields: 'type' and/or 'content'" },
        { status: 400 }
      );
    }

    // Validate `type` and `status` values
    if (!Object.values(ValidationRequestType).includes(body.type)) {
      return NextResponse.json(
        { error: `Invalid 'type' value: ${body.type}` },
        { status: 400 }
      );
    }

    // Create validation request
    const validationRequest = await createValidationRequest({
      status: "PENDING" as ValidationRequestStatus,
      type: body.type as ValidationRequestType,
      content: body.content,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(validationRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating validation request:", error);
    return NextResponse.json(
      { error: "Failed to create validation request" },
      { status: 500 }
    );
  }
}