//const express = require('express');
//const mysql = require('mysql2/promise.js')

import express from 'express';
import mysql from 'mysql2/promise';

const app = express(); // ✅ CRIA O APP

const PORT = 3000;

app.use(express.json());

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

//CONFIG CONEXAO DO BANCO DE DADOS
const dbConfig = {

    host: 'localhost',
    user: 'root',
    password: '@15041998H',
    database: 'todo_app'
}

app.post('/tasks', async(req, res)=>{

    try{
        const conection = await mysql.createConnection(dbConfig);
        const {description} = req.body;
        
        const [result] = await conection.execute(
            'INSERT INTO tasks (description) VALUES (?)',
            [description]
        )

        await conection.end();
        console.log(description);
        res.status(201).json({id: result.insertId, description, completed: false});

    }catch(error){
        console.error('Erro ao criar tarefa: ', error);
        res.status(500).json({error: 'Erro interno do servidor'});
    }
});

app.get('/tasks', async (req, res)=>{

    try{
        const conection = await mysql.createConnection(dbConfig);
        const [rows] = await conection.execute('SELECT * FROM tasks');
        await conection.end();
        res.json(rows);

    } catch (error){
        console.error('Erro ao listar tarefa: ', error);
        res.status(500).json({error: 'Erro interno do servidor'});
    }

});

app.put('/tasks/:id', async (req, res)=>{

    try{
        const conection = await mysql.createConnection(dbConfig);

        const {id} = req.params;
        const {description, completed} = req.body;
        const [result] = await conection.execute(
            'UPDATE tasks SET description = ?, completed = ? WHERE id=?',
            [description, completed, id]
        );
        await conection.end();

        if(result.affectedRows === 0){
            return res.status(404).json({error: 'Tarefa não encontrada'});
        }
        res.json({message: 'Tarefa atualizada com sucesso!'});

    } catch (error){
        console.error('Erro ao atualizar tarefa: ', error);
        res.status(500).json({error: 'Erro interno do servidor'});
    }
    
    
    
});

app.delete('/tasks/:id', async(req, res)=>{
    
    try{

        const conection = await mysql.createConnection(dbConfig);

        const {id} = req.params;
        const [result] = await conection.execute(
            'DELETE FROM tasks WHERE id=?', [id]);
     
        await conection.end();

        if(result.affectedRows === 0){
            return res.status(404).json({error: 'Tarefa não encontrada!'})
        }

        res.json({message:'Tarefa deletada com sucesso!'})

    }catch(error){
        console.error('Erro ao deletar tarefa: ', error);
        res.status(500).json({error: 'Erro interno do servidor'});
    }
})

app.listen(PORT, ()=>{
    console.log(`Servidor rodando em http://localhost:${PORT}`)
});

