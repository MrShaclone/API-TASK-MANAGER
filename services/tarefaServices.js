const db = require('../config/db');

//Função assíncrona para requisitar todas as tarefas do banco de dados
async function listarQuery() {
    const [resultado] = await db.query('SELECT * FROM tarefas');
    return resultado;
}

async function criarQuery({titulo, descricao, status, prioridade, data_entrega}){
    const query = 'INSERT INTO tarefas (titulo, descricao, status, prioridade, data_entrega) VALUES (?,?,?,?,?)';
    await db.query(query, [titulo, descricao, status, prioridade, data_entrega]);
}

async function atualizarQuery(id, {titulo, descricao, status, prioridade, data_entrega}){
    const query = 'UPDATE tarefas set titulo = ?, descricao = ?, status = ?, prioridade = ?, data_entrega = ? WHERE id = ?';
    const [resultado] = await db.query(query, [titulo, descricao, status, prioridade, data_entrega, id])
    return resultado.affectedRows;
}

async function deletarQuery(id){
    const query = 'DELETE FROM tarefas WHERE id = ?';
    const [resultado] = await db.query(query, [id])
    return resultado.affectedRows;
}


module.exports = {listarQuery, criarQuery, atualizarQuery, deletarQuery}