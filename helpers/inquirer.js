import colors from 'colors';
import inquirer from 'inquirer';

const preguntas = [
    {
        type:'list',
        name:'opcion',
        message:'Que deseas hacer?',
        choices: [
            {
                value:1,
                name:`${colors.green('1.')} Buscar ciudad`
            },
            {
                value:2,
                name:`${colors.green('2.')} Historial`
            },
            {
                value:0,
                name:`${colors.green('0.')} Salir`
            },
        ]
    }
]

export const inquirerMenu = async() =>{
    console.log(colors.cyan('==================================='));
    console.log(colors.cyan('       Seleccione una opcion       '));
    console.log(colors.cyan('===================================\n'));

    const opt = await inquirer.prompt(preguntas);
    return opt.opcion;
}

export const inquirerPause = async() => {
    console.log('\n');
    await inquirer.prompt([
      {
        type: 'input',
        name: 'enter',
        message: `Presiona ${colors.cyan('ENTER')} para continuar`,
      },
    ]);
}

export const listarLugares = async(lugares=[])=>{
    const choices = lugares.map((lugar,i) => {
        const idx = i+1
        return {
                value: lugar.id,
                name: `${idx} ${lugar.nombre}`
        }
    });

    choices.unshift({
        value:'0',
        name: `${colors.cyan('0.')} Cancelar`

    })

    const preguntas = [
        {
            type:'list',
            name: 'id',
            message:'Seleccione el lugar',
            choices : choices
        }
    ]

    const {id} = await inquirer.prompt(preguntas);
    return id;
}

export const confirmar = async(message)=>{
    const question = [
        {
            type: 'confirm',
            name:'ok',
            message: message
        }
    ]

    const {ok} = await inquirer.prompt(question);
    return ok;
}


export const leerInput = async(message) => {

    const question =[
        {
            type:'input',
            name:'desc',
            message:message,
            validate(value){
                if(value.length === 0){
                    return 'Porfavor ingrese un valor'
                }
                return true;
            }
        }
    ];

    const desc = await inquirer.prompt(question);

    return desc;

}


export const mostrarListadoChecklist = async(tareas=[])=>{
    const choices = tareas.map((tarea,i) => {
        const idx = i+1;
        return {
            value: tarea.id,
            name: `${idx} ${tarea.desc}`,
            checked: (tarea.completadoEn !== null)
        }
    });

    const preguntas = [
        {
            type:'checkbox',
            name: 'ids',
            message:'Seleccione',
            choices : choices
        }
    ]

    const {ids} = await inquirer.prompt(preguntas);
    return ids;
}