import * as fs from "fs";
import * as path from "node:path";
import {Router} from "express";

export async function getAllRoutes(routesPath: string){
    let routes = fs.readdirSync(routesPath, {recursive: true}) as string[]
    const router = Router()
    for (let route of routes){
        if (!route.endsWith(".ts") && !route.endsWith(".js")) continue
        route = "/" + route.substring(0, route.length - 3).replaceAll("\\","/" )
        let importedRouter: {default: Router} = await import(path.join(routesPath, route))
        if (route.endsWith("index"))
            router.use(route.substring(0, route.lastIndexOf("/")), importedRouter.default)
        else
            router.use(route, importedRouter.default)
    }
    return router
}