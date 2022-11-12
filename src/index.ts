import { PrismaClient } from '@prisma/client';
import chalk from 'chalk';
import { Command } from 'commander';
import { argv } from 'process';
import prompt from 'prompts';
import { ExpensesBook } from './service/Expenses.service';

export const prisma = new PrismaClient();

const cli = new Command();

const main = async () => {
  try {
    cli.name('ExpensesBook').description('Libro de gastos').version('0.0.1');
    cli
      .command('start')
      .description('Init')
      .action(async () => {
        console.log('Bienvenido al libro de gastos');
        const { action } = await prompt({
          type: 'select',
          name: 'action',
          message: 'Elige una opción',
          choices: [
            {
              title: 'Nuevo gasto',
              value: 'C',
            },
            {
              title: 'Listar gastos',
              value: 'R',
            },
            {
              title: 'Actualizar gasto',
              value: 'U',
            },
            {
              title: 'Eliminar gasto',
              value: 'D',
            },
          ],
        });
        switch (action) {
          case 'C':
            const { description } = await prompt({
              type: 'text',
              name: 'description',
              message: 'Ingresa una descripción',
            });
            const { amount } = await prompt({
              type: 'number',
              name: 'amount',
              message: 'Ingresa el importe',
            });
            try {
              const { success } = await ExpensesBook.create({ description, amount });

              return success
                ? console.log(chalk.green('Gasto creado con éxito'))
                : console.log(chalk.red('Error a crear el gasto'));
            } catch (error) {
              return console.log(chalk.red('Error a crear el gasto'));
            }
          case 'R':
            const { data, success, total } = await ExpensesBook.getAll();
            if (success) {
              console.table(data);
              return console.log(chalk.bgBlue('Total de gastos: '), chalk.red('$' + total?._sum.amount));
            }
          case 'U':
            const { ID } = await prompt({
              type: 'number',
              name: 'ID',
              message: 'Ingresa el id del gasto a modificar',
            });
            const { exists, data: expense } = await ExpensesBook.getById(ID);
            if (exists) {
              const { descriptionUpdate } = await prompt({
                type: 'text',
                name: 'descriptionUpdate',
                message: 'Ingresa la nueva descripción',
              });
              const { amountUpdate } = await prompt({
                type: 'number',
                name: 'amountUpdate',
                message: 'Ingresa el importe',
              });

              const desc = !!descriptionUpdate ? descriptionUpdate : expense?.description;
              const am = !!amountUpdate ? amountUpdate : expense?.amount;

              try {
                const { success } = await ExpensesBook.update(ID, {
                  description: desc,
                  amount: am,
                });

                return success
                  ? console.log(chalk.green('Gasto modificado con éxito'))
                  : console.log(chalk.red('Error a modificar el gasto'));
              } catch (error) {
                return console.log(chalk.red('Error a modificar el gasto'));
              }
            } else return console.log(chalk.red('No existe un gasto con ese Id'));

          case 'D':
            const { delID } = await prompt({
              type: 'number',
              name: 'delID',
              message: 'Ingresa el id del gasto a eliminar',
            });
            const { exists: expExist } = await ExpensesBook.getById(delID);
            if (expExist) {
              const delSuccess = await ExpensesBook.delete(delID);
              return delSuccess
                ? console.log(chalk.green('Gasto eliminado con éxito'))
                : console.log(chalk.red('Error al eliminar el gasto'));
            } else return console.log(chalk.red('No existe un gasto con ese Id'));
        }
      });

    cli.parse(argv);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

main();
