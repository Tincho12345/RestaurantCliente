/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Orden from "../ui/Orden";

import {
  getFirestore,
  query,
  collection,
  where,
  onSnapshot,
} from "firebase/firestore";
import appFirebase from "../../firebase/credenciales";

const db = getFirestore(appFirebase);

const Ordenes = () => {
  // state con las ordenes
  const [ordenes, guardarOrdenes] = useState([]);
  const q = query(collection(db, "ordenes"), where("completado", "==", false));

  useEffect(() => {
    const obtenerOrdenes = () => {
      manejarSnapshot(onSnapshot);
    };
    obtenerOrdenes();
  }, []);

  function manejarSnapshot(snapshot) {
    snapshot(q, (querySnapshot) => {
      const orden = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      guardarOrdenes(orden);
    });
  }

  return (
    <>
      <h1 className="text-3xl font-light mb-4">Ordenes</h1>
      <div className="sm:flex sm:flex-wrap -mx-3">
        {ordenes.map((orden) => (
          <Orden key={orden.id} orden={orden} />
        ))}
      </div>
    </>
  );
};

export default Ordenes;
