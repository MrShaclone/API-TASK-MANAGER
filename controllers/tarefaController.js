const { error } = require('console');
const tarefasServices = require('../services/tarefaServices');
//Função assíncrona para requisitar todas as tarefas do banco de dados
async function listarTarefas(req, res) {
    try {
        const tarefas = await tarefasServices.listarQuery();
        res.status(200).json(tarefas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar tarefas' });
    }
}

async function criarTarefa(req,res){
    try{
        const novatarefa = await tarefasServices.criarQuery(req.body);
             res.status(200).json({message: 'Tarefa criada com sucesso'});
    }catch(error){
        res.status(500).json({error: 'Erro ao criar tarefa'});
    }
}

async function atualizarTarefa(req, res){
    try{
        const tarefaAtualizada = await tarefasServices.atualizarQuery(req.params.id, req.body);
        if(tarefaAtualizada === 0){
            res.status(404).json({error: 'Tarefa não encontrada'});
        }else{
            res.status(200).json({message: 'Tarefa atualizada com sucesso'});
        }
    }catch(error){
        res.status(500).json({error: 'Erro ao atualizar a tarefa'})
    }
}

async function deletarTarefa(req, res){
    try{
        const tarefaRemovida = await tarefasServices.deletarQuery(req.params.id);
        if(tarefaRemovida === 0){
            res.status(404).json({error: 'Tarefa não encontrada'})
        }else{
            res.status(204).json({mensagem: 'Tarefa deletada com sucesso'})
        }
    }catch (error){
        res.status(500).json({error: 'Erro ao deletar tarefa'})
    }
}




module.exports = { listarTarefas, criarTarefa, atualizarTarefa, deletarTarefa };
 