
const bcrypt = require('bcryptjs');
const readline = require('readline');

const leitor = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

leitor.question('Digite a senha que deseja cadastrar: ', async (senha) => {

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    console.log('\nSenha criptografada:');
    console.log(senhaCriptografada);

    leitor.close();

});
