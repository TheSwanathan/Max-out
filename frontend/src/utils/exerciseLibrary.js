export const EXERCISE_LIBRARY = {
  // CHEST
  "Barbell Bench Press": { primary: "chest", secondary: ["shoulders", "arms"], type: "compound" },
  "Dumbbell Bench Press": { primary: "chest", secondary: ["shoulders", "arms"], type: "compound" },
  "Incline Chest Press": { primary: "chest", secondary: ["shoulders", "arms"], type: "compound" },
  "Chest Fly": { primary: "chest", secondary: ["shoulders"], type: "secondary" },
  "Cable Fly": { primary: "chest", secondary: ["shoulders"], type: "secondary" },
  "Push-ups": { primary: "chest", secondary: ["shoulders", "arms", "core"], type: "compound" },
  "Dips": { primary: "chest", secondary: ["shoulders", "arms"], type: "compound" },

  // BACK
  "Pull-ups": { primary: "back", secondary: ["arms", "shoulders"], type: "compound" },
  "Chin-ups": { primary: "back", secondary: ["arms", "core"], type: "compound" },
  "Lat Pulldown": { primary: "back", secondary: ["arms"], type: "compound" },
  "Barbell Row": { primary: "back", secondary: ["arms", "shoulders", "core"], type: "compound" },
  "Dumbbell Row": { primary: "back", secondary: ["arms", "shoulders"], type: "secondary" },
  "Seated Cable Row": { primary: "back", secondary: ["arms"], type: "secondary" },
  "T-Bar Row": { primary: "back", secondary: ["arms", "shoulders"], type: "secondary" },
  "Deadlift": { primary: "back", secondary: ["legs", "core"], type: "compound" },

  // LEGS
  "Squat": { primary: "legs", secondary: ["core", "back"], type: "compound" },
  "Front Squat": { primary: "legs", secondary: ["core", "back"], type: "compound" },
  "Leg Press": { primary: "legs", secondary: [], type: "secondary" },
  "Lunges": { primary: "legs", secondary: ["core"], type: "secondary" },
  "Bulgarian Split Squat": { primary: "legs", secondary: ["core"], type: "secondary" },
  "Step-ups": { primary: "legs", secondary: [], type: "secondary" },
  "Leg Extension": { primary: "legs", secondary: [], type: "isolation" },
  "Leg Curl": { primary: "legs", secondary: [], type: "isolation" },
  "Romanian Deadlift": { primary: "legs", secondary: ["back", "core"], type: "compound" },
  "Calf Raises": { primary: "legs", secondary: [], type: "isolation" },

  // SHOULDERS
  "Overhead Press": { primary: "shoulders", secondary: ["arms", "core"], type: "compound" },
  "Arnold Press": { primary: "shoulders", secondary: ["arms"], type: "secondary" },
  "Lateral Raise": { primary: "shoulders", secondary: [], type: "isolation" },
  "Front Raise": { primary: "shoulders", secondary: [], type: "isolation" },
  "Rear Delt Fly": { primary: "shoulders", secondary: ["back"], type: "isolation" },
  "Upright Row": { primary: "shoulders", secondary: ["back", "arms"], type: "secondary" },

  // ARMS
  "Barbell Curl": { primary: "arms", secondary: [], type: "isolation" },
  "Dumbbell Curl": { primary: "arms", secondary: [], type: "isolation" },
  "Hammer Curl": { primary: "arms", secondary: [], type: "isolation" },
  "Preacher Curl": { primary: "arms", secondary: [], type: "isolation" },
  "Tricep Pushdown": { primary: "arms", secondary: [], type: "isolation" },
  "Skullcrusher": { primary: "arms", secondary: [], type: "isolation" },
  "Overhead Tricep Extension": { primary: "arms", secondary: [], type: "isolation" },

  // CORE
  "Plank": { primary: "core", secondary: ["shoulders"], type: "secondary" },
  "Crunches": { primary: "core", secondary: [], type: "isolation" },
  "Sit-ups": { primary: "core", secondary: [], type: "isolation" },
  "Hanging Leg Raise": { primary: "core", secondary: ["arms"], type: "secondary" },
  "Russian Twists": { primary: "core", secondary: [], type: "isolation" },
  "Cable Crunch": { primary: "core", secondary: [], type: "secondary" },
  "Ab Wheel Rollout": { primary: "core", secondary: ["shoulders", "back"], type: "compound" }
};
