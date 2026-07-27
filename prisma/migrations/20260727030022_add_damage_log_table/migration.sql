-- CreateTable
CREATE TABLE `DamageLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Rusak',
    `totalCost` INTEGER NOT NULL,
    `notes` VARCHAR(191) NULL,
    `expenseId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `DamageLog_expenseId_key`(`expenseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DamageLog` ADD CONSTRAINT `DamageLog_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DamageLog` ADD CONSTRAINT `DamageLog_expenseId_fkey` FOREIGN KEY (`expenseId`) REFERENCES `Expense`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
