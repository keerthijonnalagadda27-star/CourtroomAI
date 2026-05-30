from services.rag import answer_legal_question

print("Testing CourtRoomAI RAG pipeline...")
print("=" * 50)

question="What should I do if my landlord is not returning my deposit?"

print(f"Question: {question}")
print("=" * 50)

answer=answer_legal_question(question)

print("ANSWER:")
print(answer)
