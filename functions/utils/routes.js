import { randomUUID } from 'node:crypto';
import { Database } from './database.js';

const database = new Database();

export const routes = [
    {
        method: 'GET',
        path: '/',
        handler: async (req, res) => { // Adicionado async
            try {
                const { search } = req.query;
                const users = await database.select('api', search); // await na chamada do banco
                return res.status(200).json(users); // Retorna com status 200
            } catch (error) {
                console.error("Erro no GET /api:", error);
                return res.status(500).json({ message: "Erro interno ao buscar usuários." });
            }
        }
    },
    {
        method: 'POST',
        path: '/',
        handler: async (req, res) => { // Adicionado async
            console.log("----- INÍCIO DO HANDLER POST ----- /api");
            console.log("req (completo):", req);

            try {
                const { name, email, senha, qtdpet } = req.body;

                // Validação básica (adicione mais validações conforme necessário)
                if (!name || !email || !senha) {
                    return res.status(400).json({ message: "Campos obrigatórios faltando (name, email, senha)." });
                }

                const user = {
                    id: randomUUID(),
                    name,
                    email,
                    senha, // Lembre-se de HASH a senha em produção!!!
                    qtdpet,
                };
                const result = await database.insert('api', user); // await na chamada do banco
                console.log("Resultado do insert:", result); // Log para depuração
                return res.status(201).json({ message: "Usuário criado com sucesso!", user: result }); // Retorna 201 e o usuário criado
            } catch (error) {
                console.error("Erro no POST /api:", error);
                return res.status(500).json({ message: "Erro interno ao criar usuário." });
            }
        }
    },
    {
        method: 'PUT',
        path: '/perfil/:id',
        handler: async (req, res) => { // Adicionado async
            try {
                const { id } = req.params;
                const { name, email, senha, qtdpet } = req.body; // Incluído email
                if (!id) { //Verifica de o id foi informado
                    return res.status(400).json({ message: 'ID do usuário não fornecido.' });
                }
                // Validação básica (adicione mais validações conforme necessário)
                if (!name && !email && !senha && !qtdpet) { //Verifica se algum dado foi informado
                    return res.status(400).json({ message: "Nenhum dado para atualizar fornecido." });
                }

                const updateData = {}; //Objeto que vai armazenar os dados a serem atualizados
                //Verifica quais dados foram passados e adiciona ao updateData
                if (name) updateData.name = name;
                if (email) updateData.email = email;
                if (senha) updateData.senha = senha;  // Lembre-se de HASH a senha em produção!!!
                if (qtdpet) updateData.qtdpet = qtdpet;

                const success = await database.update('api', id, updateData); // await na chamada do banco

                if (success) {
                    return res.status(204).send(); // 204 No Content para sucesso
                } else {
                    return res.status(404).json({ message: "Usuário não encontrado." }); // 404 se o update falhar (ex: ID não existe)
                }
            } catch (error) {
                console.error("Erro no PUT /api/perfil/:id:", error);
                return res.status(500).json({ message: "Erro interno ao atualizar perfil." });
            }
        }
    },
    {
        method: 'DELETE',
        path: '/:id', // CORRIGIDO: Removido o /api duplicado
        handler: async (req, res) => { // Adicionado async
            try {
                const { id } = req.params;
                const success = await database.delete('api', id); // await na chamada do banco

                if (success) {
                    return res.status(204).send(); // 204 No Content para sucesso
                } else {
                    return res.status(404).json({ message: "Usuário não encontrado." }); // 404 se o delete falhar (ex: ID não existe)
                }
            } catch (error) {
                console.error("Erro no DELETE /api/:id:", error);
                return res.status(500).json({ message: "Erro interno ao excluir usuário." });
            }
        }
    },
    {
        method: 'POST',
        path: '/login',
        handler: async (req, res) => {
            try {
                const { email, senha } = req.body;

                if (!email || !senha) {
                    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
                }

                const user = await database.findUserByEmail('api', email);

                if (!user) {
                    return res.status(404).json({ message: 'Usuário não encontrado.' });
                }

                // SIMPLIFICAÇÃO EXTREMA: Comparação de senha em texto plano (INSEGURO!)
                if (user.senha !== senha) {
                    return res.status(401).json({ message: 'Credenciais inválidas.' });
                }

                return res.status(200).json({ message: 'Login bem-sucedido!', username: user.name, email: user.email, id: user.id });
            } catch (error) {
                console.error("Erro no POST /login:", error);
                return res.status(500).json({ message: "Erro interno no login." })
            }
        }
    },
    {
        method: 'GET',
        path: '/perfil',
        handler: async (req, res) => { // Mantido async, mesmo sem operação de banco de dados (boa prática)
            try {
                return res.status(200).json({ message: 'Rota de perfil (sem proteção real no backend - Opção 1). Autenticação simulada no frontend.' });
            } catch (error) {
                console.error("Erro no GET /api/perfil", error);
                return res.status(500).json({ message: "Erro interno ao acessar o perfil." });
            }
        }
    },
    {
        method: 'PUT',
        path: '/perfil/:id',  // CORRIGIDO
        handler: async (req, res) => { // Mantido async
            try {
                const { id } = req.params;
                const { name, qtdpet, senha, email } = req.body;

                if (!id) {
                    return res.status(400).json({ message: 'ID do usuário não fornecido.' });
                }
                if (!name && !qtdpet && !senha && !email) {
                    return res.status(400).json({ message: 'Nenhum dado para atualizar fornecido.' });
                }

                const dadosParaAtualizar = {};
                if (name) dadosParaAtualizar.name = name;
                if (email) dadosParaAtualizar.email = email;
                if (senha) dadosParaAtualizar.senha = senha;
                if (qtdpet) dadosParaAtualizar.qtdpet = qtdpet;

                const success = await database.update('api', id, dadosParaAtualizar); // await na chamada do banco

                if (success) {
                    return res.status(204).send();
                } else {
                    return res.status(404).json({ message: "Usuário não encontrado." });
                }
            } catch (error) {
                console.error("Erro no PUT /api/perfil/:id:", error);
                return res.status(500).json({ message: "Erro interno ao atualizar o perfil." });
            }
        }
    },
];