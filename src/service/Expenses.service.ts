import dayjs from 'dayjs';
import { prisma } from '..';

const capitalize = (words: string) => words.split(' ').map((s) => s[0].toUpperCase() + s.slice(1).toLowerCase());

interface IExpense {
  description: string;
  amount: number;
}

export class ExpensesBook {
  constructor() {}
  public static async create({ description, amount }: IExpense) {
    try {
      await prisma.expenseBook.create({
        data: { description: String(capitalize(description)), amount: +amount, date: dayjs().format('DD-MM-YYYY') },
      });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }
  public static async getAll() {
    try {
      const data = await prisma.expenseBook.findMany({});
      const total = await prisma.expenseBook.aggregate({
        _sum: {
          amount: true,
        },
      });
      return { success: true, data, total };
    } catch (error) {
      return { success: false };
    }
  }
  public static async getById(id: number) {
    try {
      const data = await prisma.expenseBook.findUniqueOrThrow({ where: { id } });
      return { exists: true, data };
    } catch (error) {
      return { exists: false, data: null };
    }
  }
  public static async update(id: number, { description, amount }: IExpense) {
    try {
      await prisma.expenseBook.update({
        where: { id },
        data: { description: String(capitalize(description)), amount: +amount, date: dayjs().format('DD-MM-YYYY') },
      });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }
  public static async delete(id: number) {
    try {
      await prisma.expenseBook.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
