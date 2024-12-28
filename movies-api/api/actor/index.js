import express from "express";
import asyncHandler from "express-async-handler";
import Actor from "./actorModel.js";
import { getActorDetails, getActorMovies } from "../tmdb-api.js";

const router = express.Router();

/**
 * @swagger
 * /api/actors:
 *   get:
 *     summary: Get all actors
 *     description: Retrieve a list of all actors from the database.
 *     responses:
 *       200:
 *         description: Successfully retrieved all actors.
 *       500:
 *         description: Internal server error.
 */
router.get('/', asyncHandler(async (req, res) => {
    const actors = await Actor.find();
    res.status(200).json(actors);
}));

/**
 * @swagger
 * /api/actors/{id}:
 *   get:
 *     summary: Get actor details
 *     description: Retrieve details of a specific actor by their ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the actor to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved actor details.
 *       404:
 *         description: Actor not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id", asyncHandler(async (req, res) => {
    const { id } = req.params;

    let actor = await Actor.findOne({ actorId: id });
    if (!actor) {
        const actorDetails = await getActorDetails(id);

        actor = await Actor.create({
            actorId: id,
            name: actorDetails.name,
            biography: actorDetails.biography || "Biography not available",
            birthday: actorDetails.birthday || "Unknown",
            profile_path: actorDetails.profile_path || null,
            movies: [], 
        });
    }

    res.status(200).json(actor);
}));

/**
 * @swagger
 * /api/actors/{id}/movies:
 *   get:
 *     summary: Get movies by actor
 *     description: Retrieve a list of movies in which a specific actor has performed.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the actor to retrieve their movies.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved the actor's movies.
 *       404:
 *         description: Actor not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id/movies", asyncHandler(async (req, res) => {
    const { id } = req.params;

    let actor = await Actor.findOne({ actorId: id });
    if (!actor) {
        return res.status(404).json({ error: "Actor not found" });
    }

    const moviesData = await getActorMovies(id);

    actor.movies = moviesData.cast.map((movie) => ({
        movieId: movie.id,
        title: movie.title,
        character: movie.character,
    }));

    await actor.save();

    res.status(200).json(actor.movies);
}));

export default router;
