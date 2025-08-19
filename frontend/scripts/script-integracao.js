const urlAPI = "http://localhost:3000/tarefas";


/*Seleciona cada elemento do DOM (Document Object Model) presente
na página HTML para manipulá-la

Aloca o valor que o usuário digitar no input na variável chamada
inputTarefa*/
const inputTarefa = document.querySelector(".campo-tarefa");

//descricao
const inputDescricao = document.querySelector(".descricao-tarefa");

//data
const inputData = document.querySelector(".data-tarefa");

const inputStatus = document.querySelector(".status");

const inputPrioridade = document.querySelector(".prioridade");

/*Seleciona o botão de adicionar tarefa e aloca na variável
botaoAdicionar, que será utilizado para adicionar uma nova tarefa*/
const botaoAdicionar = document.querySelector(".botao-adicionar");

/*Seleciona a lista de tarefas e aloca na variável listaTarefas,
que será utilizada para exibir as tarefas na tela*/
const listaTarefas = document.querySelector(".lista-tarefas");


/*Função para carregar as tarefas adicionadas na tela*/
async function renderizarTarefas() {
    try {
        const resposta = await fetch(urlAPI);
        const tarefas = await resposta.json();

        tarefas.forEach(tarefa => {
            const itemLista = document.createElement('li');
            itemLista.className = 'item-tarefa';
            itemLista.textContent = tarefa.titulo;
            
    // formatar a data sem o horario
    let dataFormatada = '-';
    if (tarefa.data_entrega) {
        const data = new Date(tarefa.data_entrega);
        dataFormatada = data.toISOString().slice(0, 10);
    }

    itemLista.innerHTML = `
        <strong>${tarefa.titulo}</strong><br>
        <span>Prioridade: ${tarefa.prioridade || '-'}</span> |
        <span>Status: ${tarefa.status || '-'}</span> |
        <span>Entrega: ${dataFormatada}</span>
    `;
            

            /*Botão remover criado para cada item da lista, isto é, para cada tarefa da lista*/
            const botaoRemover = document.createElement('button');
            botaoRemover.className = 'botao-remover';
            botaoRemover.textContent = 'Excluir';

            botaoRemover.addEventListener("click", () => 
                removerTarefa(tarefa.id)
            );

            /*Botão editar criado para editar cada item da lista -> AINDA NÃO FUNCIONAL*/
            const botaoEditar = document.createElement('button');
            botaoEditar.className = 'botao-editar';
            botaoEditar.textContent = 'Editar';

            botaoEditar.addEventListener("click", () => {
                editarTarefa(tarefa.id, tarefa.titulo);
            })

            itemLista.appendChild(botaoRemover);
            itemLista.appendChild(botaoEditar);
            listaTarefas.appendChild(itemLista);
        });
    }

    catch (erro) {
        console.error("Erro ao renderizar tarefas: " + erro);
    }
}




/*Função assíncrona para adicionar uma nova tarefa à lista de tarefas*/
async function adicionarTarefa(titulo) {
    //Limpa o elemento ul (listaTarefas)
    listaTarefas.innerHTML = "";

    try {
        await fetch(urlAPI, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                /*Por enquanto, adicionaremos somente o título*/
                titulo: titulo,
                descricao: inputDescricao.value.trim(),
                data_entrega: inputData.value.trim(),
                status: inputStatus.value.trim(),
                prioridade: inputPrioridade.value.trim()
             })
        });
        /*A cada nova tarefa adicionada, executa renderizarTarefas() para que todas apareçam na
        tela, inclusive a última adicionada*/
        renderizarTarefas();
    }
    catch (erro) {
        console.error("Erro ao adicionar tarefa:", erro);
    }
}

/*Função para editar tarefa*/
async function editarTarefa(id, tituloAtual) {
    const novoTitulo = prompt('Editar título:', tituloAtual);

    //Se um novo título for digitado e ele for diferente de vazio
    if (novoTitulo && novoTitulo.trim() !== "") {
        try {
            await fetch(`${urlAPI}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    titulo: novoTitulo
                })
            });
            listaTarefas.innerHTML = "";
            renderizarTarefas();
        } catch (erro) {
            console.error("Erro ao editar tarefa", erro);
        }
    }
}


/*Função para remover a tarefa*/
async function removerTarefa(id) {
    listaTarefas.innerHTML = "";
    try {
        await fetch(`${urlAPI}/${id}`, {
            method: "DELETE"
        });
        renderizarTarefas();
    }
    catch (erro) {
        console.error("Erro ao deletar tarefa: ", erro);
    }
}











/*Evento listener para o botão de adicionar tarefa, para que seja monitorado
o clique do usuário no botão*/

botaoAdicionar.addEventListener("click", function (evento) {
    /*Evita o comportamento padrão do botão, que é enviar um formulário*/
    evento.preventDefault();
    const novaTarefa = inputTarefa.value.trim();

    /*Verifica se o campo de input não está vazio, caso esteja,
    não adiciona a tarefa*/
    if (novaTarefa !== "") {
        adicionarTarefa(novaTarefa);
        //Limpa o campo de input após adicionar a tarefa
        inputTarefa.value = ""; 
    }
});

//Iniciar a aplicação com as tarefas já renderizadas
renderizarTarefas();