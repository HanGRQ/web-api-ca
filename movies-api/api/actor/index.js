import express from "express";
import asyncHandler from "express-async-handler";
import Actor from "./actorModel.js";
import { getActorDetails, getActorMovies } from "../tmdb-api.js";

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
    const actors = await Actor.find();
    res.status(200).json(actors);
}));

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
