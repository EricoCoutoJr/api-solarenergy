const { Unidade } = require('../models/unidade')
const { Generation } = require('../models/generation')
const { checkBody } = require('../services/checkBody')

class UnitController {

    async createUnit(req, res) {
        try {
            const {
                name,
                address,
                brand,
                model,
                active
            } = req.body

            const dataPermited = [
                "name",
                "address",
                "brand",
                "model",
                "active"
            ]

            if (checkBody(dataPermited, req.body)) {
                return res.status(400).send({
                    msg: "Algum campo enviado não é permitido"
                })
            }

            const data = await Unidade.create({
                name,
                address,
                brand,
                model,
                active
            })

            return res.status(201).send({
                msg: "Nova unidade criada com sucesso",
                newUnit: data
            })
        } catch (error) {
            const message = error.message.msg || error.message
            return res.status(400).send({
                message
            })
        }
    }

    async listOneUnit(req, res) {
        try {
            const { id } = req.params

            if (id <= 0) {
                return res.status(400).send({
                    msg: "O id deve ser um número positivo"
                })
            }

            const unitExist = await Unidade.findOne({ where: { id } })
            if (!unitExist) {
                return res.status(400).send({
                    msg: "O id informado não consta no banco de dados"
                })
            }

            return res.status(200).send(unitExist)
        } catch (error) {
            return res.status(400).send(error.message)
        }
    }

    async editUnit(req, res) {
        try {
            const { id } = req.params
            const {
                name,
                address,
                brand,
                model,
                active
            } = req.body

            const dataPermited = [
                "name",
                "address",
                "brand",
                "model",
                "active"
            ]

            if (id <= 0) {
                return res.status(400).send({
                    msg: "O id deve ser um número positivo"
                })
            }

            if (checkBody(dataPermited, req.body)) {
                return res.status(400).send({
                    msg: "Algum campo enviado não é permitido"
                })
            }

            const unitExist = await Unidade.findOne({ where: { id } })
            if (!unitExist) {
                return res.status(400).send({
                    msg: "O id informado não consta no banco de dados"
                })
            }

            if (!name || !address || !brand || !model || !active) {
                return res.status(400).send({
                    msg: "Os campos name, address,brand, model e active são obrigatórios"
                })
            }


            await Unidade.update({
                name,
                address,
                brand,
                model,
                active
            }, {
                where: { id }
            })

            return res.status(200).send({
                msg: "Unidade atualizada com sucesso",
                updatedUnit: {
                    id,
                    name,
                    address,
                    brand,
                    model,
                    active
                }
            })
        } catch (error) {
            return res.status(400).send(error.message)
        }
    }

    async deleteUnit(req, res) {
        try {
            const { id } = req.params

            if (id <= 0) {
                return res.status(400).send({
                    msg: "O id deve ser um número positivo"
                })
            }

            const unitExist = await Unidade.findOne({ where: { id } })
            if (!unitExist) {
                return res.status(400).send({
                    msg: "O id informado não consta no banco de dados"
                })
            }

            const generation = await Generation.findOne({ where: { created_by: id } });

            if (generation) {
                throw new Error('Não é possível excluir a unidade, pois existem lançamentos associados a ele.');
            }

            await Unidade.destroy({ where: { id } })

            return res.status(200).send("Unidade deletada com sucesso")
        } catch (error) {
            return res.status(400).send(error.message)
        }
    }
}

module.exports = new UnitController();