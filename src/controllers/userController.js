import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

export const register = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    try {
        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.status(409).json({ message: "Já existe um usuário cadastrado com esse email." });
        }

        if (!username || !email || !password) {
            return res.status(422).json({ message: "Por favor, preencha todos os campos obrigatórios." });
        }

        if (password !== confirmPassword) {
            return res.status(422).json({ message: "As senhas devem ser iguais." });
        }

        const passHash = await bcrypt.hash(password, 10);
        const newUser = { username, email, password: passHash };
        await User.create(newUser);

        return res.status(201).json({ message: "Usuário criado com sucesso!" });
    } catch (error) {
        return res.status(500).json({ error: "Ocorreu um erro durante o registro." });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        return res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ error: "Ocorreu um erro durante o login." });
    }
};
