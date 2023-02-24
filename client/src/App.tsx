import React, { useState, useEffect } from "react";

type Exercise = {
  id: number;
  name: string;
  repCount: number;
  totalCount: number;
};

const initialExercises: Exercise[] = [
  { id: 1, name: "Push-ups", repCount: 0, totalCount: 0 },
  { id: 2, name: "Dips", repCount: 0, totalCount: 0 },
  { id: 3, name: "Pull-ups", repCount: 0, totalCount: 0 },
  { id: 4, name: "Chin-ups", repCount: 0, totalCount: 0 },
  { id: 5, name: "Squats", repCount: 0, totalCount: 0 },
];

const App: React.FC = () => {
  const [exercises, setExercises] = useState(initialExercises);
  const [exerciseTables, setExerciseTables] = useState<{ date: string; exercises: Exercise[] }[]>([]);
  const [newExercise, setNewExercise] = useState("");

    // Check if exercise tables are in localStorage and set state if they are
    if (localStorage.getItem("exerciseTables")) {
      const tables = JSON.parse(localStorage.getItem("exerciseTables") || "");
      const updatedTables = tables.filter((v: any) => v && v.exercises);
      setExerciseTables(updatedTables);
    }
    
  useEffect(() => {
    const prevExercises = localStorage.getItem("prevExercises");
    if (prevExercises) {
      setExercises(JSON.parse(prevExercises));
    }
    const storedExerciseTables = localStorage.getItem("exerciseTables");
    if (storedExerciseTables) {
      setExerciseTables(JSON.parse(storedExerciseTables));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("prevExercises", JSON.stringify(exercises));
  }, [exercises]);

  const handleExerciseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewExercise(event.target.value);
  };

  const handleAddExercise = () => {
    const newId = exercises.length + 1;
    setExercises([...exercises, { id: newId, name: newExercise, repCount: 0, totalCount: 0 }]);
    setNewExercise("");
  };

  const handleRepCountChange = (id: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const newExercises = exercises.map((exercise) => {
      if (exercise.id === id) {
        return { ...exercise, repCount: Number(event.target.value) };
      } else {
        return exercise;
      }
    });
    setExercises(newExercises);
  };

  const handleAddToTotal = (id: number) => {
    const newExercises = exercises.map((exercise) => {
      if (exercise.id === id) {
        return { ...exercise, totalCount: exercise.totalCount + exercise.repCount, repCount: 0 };
      } else {
        return exercise;
      }
    });
    setExercises(newExercises);
  };

  const handleDeleteExercise = (id: number) => {
    const newExercises = exercises.filter((exercise) => exercise.id !== id);
    setExercises(newExercises);
  };

  const handleFinishDay = () => {
    const currentDate = new Date().toLocaleDateString();
    // Create a new table with the same structure and data as the original table
    const newExercises = exercises.map((exercise) => ({ ...exercise }));
    // Add the new table to the list of tables
    setExerciseTables([...exerciseTables, { date: currentDate, exercises: newExercises }]);
    // Store the updated exercise tables in localStorage
    localStorage.setItem("exerciseTables", JSON.stringify([...exerciseTables, { date: currentDate, exercises: newExercises }]));
    // Reset the original table to the initial value
    setExercises(initialExercises);
};

const handleClearTables = () => {
  localStorage.removeItem("exerciseTables");
  setExerciseTables([]);
};

  return (
    <div className="App">
      <h1></h1>
      <div className="add-exercise">
        <input type="text" value={newExercise} onChange={handleExerciseChange} placeholder="Enter new exercise" />
        <button onClick={handleAddExercise}>Add</button>
      </div>
      <table className="main-table">
        <thead>
          <tr>
            <th>Exercise</th>
            <th className="centercol">Rep Count</th>
            <th className="centercol">Add</th>
            <th>Total Count</th>
            <th className="centercol">Delete</th>
          </tr>
        </thead>
        <tbody>
          {exercises.map((exercise) => (
            <tr key={exercise.id}>
              <td>{exercise.name}</td>
              <td>
                <input type="number" value={exercise.repCount} onChange={(event) => handleRepCountChange(exercise.id, event)} />
              </td>
              <td>
                <button onClick={() => handleAddToTotal(exercise.id)}>Add</button>
              </td>
              <td>{exercise.totalCount}</td>
              <td>
                <button onClick={() => handleDeleteExercise(exercise.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="finishButton" onClick={handleFinishDay}>Finish Day</button>
      {exerciseTables.length > 0 && (
        <div className="exercise-tables">
          {exerciseTables.length > 0 && (
  <div className="exercise-tables">
    {exerciseTables.map((table: { date: string, exercises: Exercise[] }, index: number) => (
      <div key={table.date}>
        <h5 className="date">{table.date}</h5>
        <table>
          <thead>
            <tr>
              <th>Exercise</th>
              <th className="totalcol">Total Count</th>
            </tr>
          </thead>
          <tbody>
            {table.exercises.map((exercise: Exercise) => (
              <tr key={exercise.id}>
                <td>{exercise.name}</td>
                <td >{exercise.totalCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ))}
  </div>
)}
      <button className="finishButton" onClick={handleClearTables} >Clear Tables</button>
        </div>
      )}
    </div>
  );
};

export default App;
