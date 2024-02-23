/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Platillo from "../ui/Platillo";

import { collection, query, onSnapshot } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import appFirebase from "../../firebase/credenciales";

const db = getFirestore(appFirebase);

const Menu = () => {
  const [platillos, setPlatillos] = useState([]); // useState para platillos

  useEffect(() => {
    const obtenerPlatillos = () =>
      onSnapshot(query(collection(db, "productos")), (querySnapshot) => {
        const platillos = querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
        setPlatillos(platillos);
      });
    obtenerPlatillos();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-light mb-4">Menú</h1>
      <Link
        to="/nuevo-platillo"
        className="border rounded-full bg-blue-800 hover:bg-blue-600, inline-block mb-5 p-2 text-white uppercase font-bold"
      >
        Agregar Platillo
      </Link>
      {platillos.map((platillo) => (
        <Platillo key={platillo.id} platillo={platillo} />
      ))}
    </>
  );
};

export default Menu;
