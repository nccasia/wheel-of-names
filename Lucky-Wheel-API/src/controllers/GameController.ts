import { IGameService } from "@/interfaces/IGameService";
import { BaseQuery } from "@/models/common/BaseQuery";
import { before, GET, POST, route } from "awilix-express";
import { plainToInstance } from "class-transformer";
import { Request, Response } from "express";
// DOT NOT REMOVE COMMENTS WHICH START WITH /** @swagger AND END WITH */
// IT'S USED TO GENERATE SWAGGER DOCUMENTS
/**
 * @swagger
 * "tags": {
 *   "name": "Game",
 *   "description": "API for Game"
 * }
 */
@route("/games")
export class GameController {
    private _gameService: IGameService
    constructor(GameService: IGameService) {
        this._gameService = GameService;
    }
    @POST()
    @route("/spin-wheel")
    public async spinWheelAsync(req: Request, res: Response) {
        const response = await this._gameService.spinWheelAsync(req.body);
        return res.status(response.statusCode).json(response);
    }

    /**
    * @swagger
    * "/games/histories": {
    *   "get": {
    *    "summary": "Get spin histories",
    *   "description": "Using this endpoint, you can get the spin histories",
    * "tags": ["Game"],
    * "parameters": [
    *   {
    *    "name": "page",
    *   "in": "query",
    *  "required": true,
    *  "description": "Page number",
    * "schema": {
    *   "type": "number"
    * }
    * },
    * {
    *  "name": "limit",
    * "in": "query",
    * "required": true,
    * "description": "Number of items per page",
    * "schema": {
    *  "type": "number"
    * }
    *  
    * }
    * ],
    * "responses": {
    *   "200": {
    *  "description": "Returns the spin requests",
    * "content": {
    *  "application/json": {}
    * }
    * }
    * }
    * }
    * }
    * 
   */
    @GET()
    @route("/histories")
    public async getSpinHistory(req: Request, res: Response) {
        const query = plainToInstance(BaseQuery, req.query);
        const response = await this._gameService.getSpinHistoryAsync(query);
        return res.status(response.statusCode).json(response);
    }


}