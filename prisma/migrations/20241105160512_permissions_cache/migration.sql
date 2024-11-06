-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_email_confirmed" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "permissions_cache" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "permissions" JSONB NOT NULL,
    "version" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "permissions_cache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "permissions_cache_user_id_key" ON "permissions_cache"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_cache_version_key" ON "permissions_cache"("version");

-- AddForeignKey
ALTER TABLE "permissions_cache" ADD CONSTRAINT "permissions_cache_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
