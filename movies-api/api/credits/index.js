import express from "express";
import asyncHandler from "express-async-handler";
import Credit from "./creditModel.js";
import { getMovieCredits } from "../tmdb-api.js";

const router = express.Router();

router.get('/movie/:id', asyncHandler(async (req, res) => {
    const movieId = req.params.id;

    try {
        let creditsInDB = await Credit.findOne({ movieId });

        if (!creditsInDB) {
            const data = await getMovieCredits(movieId);

            if (!data || (!data.cast && !data.crew)) {
                return res.status(404).json({ message: `No credits data found for movie ${movieId}` });
            }

            creditsInDB = await Credit.create({
                movieId,
                cast: (data.cast || []).map((actor) => ({
                    actorId: actor.id,
                    name: actor.name,
                    character: actor.character || 'Unknown',
                    profile_path: actor.profile_path || null,
                })),
                crew: (data.crew || []).map((crewMember) => ({
                    crewId: crewMember.id,
                    name: crewMember.name,
                    job: crewMember.job || 'Unknown',
                    department: crewMember.department || 'Unknown',
                })),
            });
        }

        res.status(200).json(creditsInDB);
    } catch (error) {
        console.error(`Error fetching credits for movie ${movieId}:`, error.message);
        res.status(500).json({ message: 'Failed to fetch movie credits' });
    }
}));



export default router;
