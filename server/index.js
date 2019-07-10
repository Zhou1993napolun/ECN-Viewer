/*
 * *******************************************************************************
 *   Copyright (c) 2019 Edgeworx, Inc.
 *
 *   This program and the accompanying materials are made available under the
 *   terms of the Eclipse Public License v. 2.0 which is available at
 *   http://www.eclipse.org/legal/epl-2.0
 *
 *   SPDX-License-Identifier: EPL-2.0
 * *******************************************************************************
 */

const express = require('express')
const app = express()
const path = require('path')
const proxy = require('express-http-proxy')
const getIP = require('external-ip')()

const PORT = process.env.PORT || 80

const runServer = async () => {
  app.use('/', express.static(path.join(__dirname, '../build')))

  app.use('/api/controllerAPI', (req, res, next) => {
    proxy(req.headers['ecn-api-destination'])(req, res, next)
  })

  app.use('/api/agentApi', (req, res, next) => {
    proxy(req.headers.iofogapi)(req, res, next)
  })

  app.listen(PORT, () => {
    getIP((err, ip) => {
      if (err) {
        console.log(`ECN viewer is ready on: http://0.0.0.0:${PORT}/`)
        console.log('Could not figure out external ip')
        return
      }
      console.log(`ECN viewer is ready on: http://0.0.0.0:${PORT}/`)
      console.log(`ECN viewer is ready on: http://${ip}:${PORT}/`)
    })
  })
}

runServer()
