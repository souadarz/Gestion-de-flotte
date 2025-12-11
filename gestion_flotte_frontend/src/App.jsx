// import React, { useEffect, useState } from "react";
// import api from "./services/axiosConfig";


// const App = () => {
//     const [chauf, setChauf] = useState();

//     useEffect(()=>{
//         const fetchChauf = async()=>{
//             const user = await api.get("/users/chauffeur");
//             console.log("userre", user.data);
//             setChauf(user.data);
//         }
//         fetchChauf();
//     }, [])

//   return (
//     <div>Mon app</div>
//   )
// }

// export default App

import React, { useEffect, useState } from "react";
import api from "./services/axiosConfig";

const App = () => {
  const [chauf, setChauf] = useState(null);

  useEffect(() => {
    const fetchChauf = async () => {
      try {
        // const token = localStorage.getItem("token"); // ⚠️ mets ton token ici

        const res = await fetch("http://localhost:3000/api/users/chauffeur");
        const data = await res.json();

        console.log("userre", data.data);
        setChauf(data.data);

      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    fetchChauf();
  }, []);

  return (
    <div>
      <h1>Mon App</h1>
      {chauf && <pre>{JSON.stringify(chauf, null, 2)}</pre>}
    </div>
  );
};

export default App;
