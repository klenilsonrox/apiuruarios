import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv"

dotenv.config()


export const register = async (req, res) => {
    const {
        username,
        email,
        password,
        confirmPassword
    } = req.body;

    try {
        // Verificar se o usuário já existe
        const userExist = await User.findOne({
            email
        });
        if (userExist) {
            return res.status(409).json({
                message: "Já existe um usuário cadastrado com esse email."
            });
        }

        // Validar campos obrigatórios
        if (!username) {
            return res.status(422).json({
                message: "O nome de usuário é obrigatório."
            });
        }
        if (!email) {
            return res.status(422).json({
                message: "O email é obrigatório."
            });
        }
        if (!password) {
            return res.status(422).json({
                message: "A senha é obrigatória."
            });
        }

        // Verificar se as senhas coincidem
        if (password !== confirmPassword) {
            return res.status(422).json({
                message: "As senhas devem ser iguais."
            });
        }


        // Criar usuário
        const passHash = await bcrypt.hash(password, 10);
        const newUser = {
            username,
            email,
            password: passHash
        };
        await User.create(newUser);

        return res.status(201).json({
            message: "Usuário criado com sucesso!"
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verificar se o usuário existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // Verificar a senha
        const passwordMatch =await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // Gerar um token de autenticação
        const token =jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        const {_id}= user
        return res.status(200).json({ token,_id});
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};