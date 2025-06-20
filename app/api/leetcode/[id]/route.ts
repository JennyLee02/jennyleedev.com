import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const solution = await prisma.leetcodeSolution.findUnique({
      where: { id: params.id },
    });

    if (!solution) {
      return NextResponse.json(
        { error: "Solution not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(solution);
  } catch (error) {
    console.error("Error fetching solution:", error);
    return NextResponse.json(
      { error: "Failed to fetch solution" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.leetcodeSolution.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting solution:", error);
    return NextResponse.json(
      { error: "Failed to delete solution" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const {
      title,
      number,
      difficulty,
      category,
      description,
      approach,
      solution,
      timeComplexity,
      timeComplexityExplanation,
      spaceComplexity,
      spaceComplexityExplanation,
      tags,
      leetcodeUrl
    } = await request.json()

    const updatedSolution = await prisma.leetcodeSolution.update({
      where: { id: params.id },
      data: {
        title,
        number: parseInt(number),
        difficulty,
        category,
        description,
        approach,
        solution,
        timeComplexity,
        timeComplexityExplanation: timeComplexityExplanation || null,
        spaceComplexity,
        spaceComplexityExplanation: spaceComplexityExplanation || null,
        tags,
        leetcodeUrl: leetcodeUrl || null,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(updatedSolution)
  } catch (error) {
    console.error('Failed to update solution:', error)
    return NextResponse.json(
      { error: 'Failed to update solution' },
      { status: 500 }
    )
  }
} 