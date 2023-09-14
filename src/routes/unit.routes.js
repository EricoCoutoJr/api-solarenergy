const { Router } = require('express')
const { auth } = require('../midlleware/auth')
const { createUnit,
    listOneUnit,
    editUnit,
    deleteUnit } = require('../controller/unit.controller')

class UnitRouter {

    routesFromUnit() {
        const unitRoutes = Router();
        unitRoutes.get('/v1/unidade/:id', auth, listOneUnit)
        unitRoutes.post('/v1/unidade', auth, createUnit)
        unitRoutes.put('/v1/unidade/:id', auth, editUnit)
        unitRoutes.delete('/v1/unidade/:id', auth, deleteUnit)

        return unitRoutes
    }
}

module.exports = new UnitRouter();