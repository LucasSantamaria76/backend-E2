-- CreateTable
CREATE TABLE "ExpenseBook" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExpenseBook_pkey" PRIMARY KEY ("id")
);
