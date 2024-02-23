import { useState } from "react";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

import appFirebase from "../../firebase/credenciales";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const db = getFirestore(appFirebase);
const storage = getStorage(appFirebase);

const NuevoPlatillo = () => {
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(true);
  const [image, setImage] = useState(null);

  const formik = useFormik({
    initialValues: {
      nombre: "",
      precio: "",
      categoria: "",
      imagen: "",
      descripcion: "",
    },
    // Validaciones con Yup
    validationSchema: Yup.object({
      nombre: Yup.string()
        .required("El nombre del platillo es obligatorio")
        .min(3, "El nombre debe tener al menos 3 caracteres"),
      precio: Yup.number()
        .required("El precio es obligatorio")
        .min(1, "Debes agregar un precio")
        .positive("No se aceptan números negativos"),
      categoria: Yup.string().required("La categoría es obligatoria"),
      descripcion: Yup.string()
        .required("La descripción es obligatoria")
        .min(10, "La descripción debe tener al menos 10 caracteres"),
    }),
    onSubmit: async (platillo) => {
      setEnviando(false);
      try {
        platillo.existencia = true;
        if (image.name.toString() !== "") {
          platillo.imagen = await fileHandler();
        }
        await addDoc(collection(db, "productos"), platillo);
        // Redireccionar
        alert("Platillo Agregado");
        navigate("/menu");
        setEnviando(true);
      } catch (error) {
        alert(`No se pudo Agregar el registro: ${error}`);
      }
    },
  });

  // Sube la imagen a Firebase
  const fileHandler = async () => {
    const { name } = image;
    const nombre = name.split(".")[0] + generarId();
    const refArchivo = ref(storage, `documentos/${nombre}`);
    await uploadBytes(refArchivo, image);
    const NombreUrl = await getDownloadURL(refArchivo);
    return NombreUrl;
  };
  // Genera Random Id
  function generarId() {
    const fecha = Date.now().toString(36).substr(2);
    const ramdom = Math.random().toString(36).substr(2);
    return fecha + ramdom;
  }

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-light mb-4">Agregar Platillo</h1>

      <div className="flex justify-center mt-10">
        <div className="w-full max-w-3xl">
          <form onSubmit={formik.handleSubmit}>
            {/* NOMBRE */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="nombre"
              >
                Nombre
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="nombre"
                type="text"
                placeholder="Nombre del Platillo"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nombre}
              />
            </div>
            {formik.touched.nombre && formik.errors.nombre ? (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5"
                role="alert"
              >
                <p className="font-bold">Atención</p>
                {formik.errors.nombre}
              </div>
            ) : null}
            {/* PRECIO */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="precio"
              >
                Precio
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="precio"
                type="number"
                placeholder="$20"
                min="0"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.precio}
              />
            </div>
            {formik.touched.precio && formik.errors.precio ? (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5"
                role="alert"
              >
                <p className="font-bold">Atención</p>
                {formik.errors.precio}
              </div>
            ) : null}
            {/* CATEGORIA */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="categoria"
              >
                Categoria
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="categoria"
                name="categoria"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.categoria}
              >
                <option value="">-- Seleccione --</option>
                <option value="desayuno">Desayuno</option>
                <option value="comida">Comida</option>
                <option value="cena">Cena</option>
                <option value="bebida">Bebida</option>
                <option value="postre">Postre</option>
                <option value="ensalada">Ensalada</option>
              </select>
            </div>
            {formik.touched.categoria && formik.errors.categoria ? (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5"
                role="alert"
              >
                <p className="font-bold">Atención</p>
                {formik.errors.categoria}
              </div>
            ) : null}
            {/* IMAGEN */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="imagen1"
              >
                Imagen
              </label>
              <input
                type="file"
                className="shadow appearance-none border rounded 
                  w-full py-2 px-3 text-gray-700 leading-tight 
                  focus:outline-none focus:shadow-outline"
                onChange={handleChange}
              />
            </div>
            {formik.touched.imagen && formik.errors.imagen ? (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5"
                role="alert"
              >
                <p className="font-bold">Atención</p>
                {formik.errors.imagen}
              </div>
            ) : null}
            {/* DESCRIPCION */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="descripcion"
              >
                Descripcion
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="descripcion"
                placeholder="Descripcion del Platillo"
                rows="5"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.descripcion}
              ></textarea>
            </div>
            {formik.touched.descripcion && formik.errors.descripcion ? (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5"
                role="alert"
              >
                <p className="font-bold">Atención</p>
                {formik.errors.descripcion}
              </div>
            ) : null}
            <input
              type="submit"
              className="bg-gray-800 hover:bg-gray-900 w-full mt-5 p-2 text-white uppercase font-bold"             
              value="Agregar"
              disabled={!enviando}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default NuevoPlatillo;
