-- CreateTable
CREATE TABLE "reset_tokens" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "expiry_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reset_tokens_uid_key" ON "reset_tokens"("uid");

-- AddForeignKey
ALTER TABLE "reset_tokens" ADD CONSTRAINT "reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
