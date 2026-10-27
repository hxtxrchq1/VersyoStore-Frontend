import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { productService } from '../services/product.service';
import { uploadService } from '../services/upload.service';

interface Variacion {
  id?: number;
  talla?: string;
  color?: string;
  codigo_color?: string;
  imagen_url?: string;
  stock: number;
  sku?: string;
  imagen_file?: File;
}

interface ColorVariacion {
  color: string;
  codigo_color: string;
  imagenes_urls: string[];
  imagenes_files: File[];
  tallas: {
    [key: string]: {
      enabled: boolean;
      stock: number;
      sku: string;
    };
  };
}

const AdminProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [temporadas, setTemporadas] = useState<any[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSeasonModal, setShowSeasonModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSeasonName, setNewSeasonName] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria_id: '',
    temporada_id: '',
    genero: 'ambos',
    imagenes: [] as string[],
    tiene_variaciones: false,
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [_variaciones, setVariaciones] = useState<Variacion[]>([]);
  const [coloresVariaciones, setColoresVariaciones] = useState<ColorVariacion[]>([]);

  useEffect(() => {
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      
      // Cargar categorías y temporadas usando api con auth
      const api = (await import('../services/api')).default;
      const [categoriasRes, temporadasRes] = await Promise.all([
        api.get('/categorias'),
        api.get('/temporadas'),
      ]);
      
      setCategorias(categoriasRes.data);
      setTemporadas(temporadasRes.data);

      // Si es edición, cargar producto
      if (isEditMode && id) {
        const producto = await productService.getById(parseInt(id));
        setFormData({
          nombre: producto.nombre,
          descripcion: producto.descripcion || '',
          precio: producto.precio.toString(),
          categoria_id: producto.categoria?.id?.toString() || '',
          temporada_id: producto.temporada?.id?.toString() || '',
          genero: producto.genero || 'ambos',
          imagenes: producto.imagenes || [],
          tiene_variaciones: (producto.variaciones?.length || 0) > 0,
        });
        setImagePreviews(producto.imagenes || []);
        
        // Transformar variaciones planas a coloresVariaciones agrupados
        if (producto.variaciones && producto.variaciones.length > 0) {
          const coloresMap = new Map<string, ColorVariacion>();
          
          for (const variacion of producto.variaciones) {
            const colorKey = variacion.color || 'sin-color';
            
            if (!coloresMap.has(colorKey)) {
              coloresMap.set(colorKey, {
                color: variacion.color || '',
                codigo_color: variacion.codigo_color || '#000000',
                imagenes_urls: variacion.imagen_url ? [variacion.imagen_url] : [],
                imagenes_files: [],
                tallas: {},
              });
            }
            
            const colorVar = coloresMap.get(colorKey)!;
            
            // Agregar la talla si existe
            if (variacion.talla) {
              colorVar.tallas[variacion.talla] = {
                enabled: true,
                stock: variacion.stock || 0,
                sku: variacion.sku || '',
              };
            }
            
            // Agregar imagen si no está ya en el array
            if (variacion.imagen_url && !colorVar.imagenes_urls.includes(variacion.imagen_url)) {
              colorVar.imagenes_urls.push(variacion.imagen_url);
            }
          }
          
          setColoresVariaciones(Array.from(coloresMap.values()));
        }
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar datos iniciales');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setImageFiles(prev => [...prev, ...files]);

    // Crear previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Función no usada actualmente - comentada para evitar warning
  // const handleVariacionChange = (index: number, field: keyof Variacion, value: any) => {
  //   setVariaciones(prev => {
  //     const updated = [...prev];
  //     updated[index] = { ...updated[index], [field]: value };
  //     return updated;
  //   });
  // };

  // Función no usada - comentada para evitar warning
  // const handleVariacionImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;
  //   setVariaciones(prev => {
  //     const updated = [...prev];
  //     updated[index] = { ...updated[index], imagen_file: file };
  //     return updated;
  //   });
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     handleVariacionChange(index, 'imagen_url', reader.result as string);
  //   };
  //   reader.readAsDataURL(file);
  // };

  // Función no usada - comentada para evitar warning
  // const agregarVariacion = () => {> {
  //   setVariaciones(prev => [...prev, {
  //     talla: '',
  //     color: '',
  //     codigo_color: '#000000',
  //     imagen_url: '',
  //     stock: 0,
  //     sku: '',
  //   }]);
  // };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Ingresa un nombre para la categoría');
      return;
    }
    try {
      const api = (await import('../services/api')).default;
      const response = await api.post('/categorias', { nombre: newCategoryName });
      setCategorias(prev => [...prev, response.data]);
      setFormData(prev => ({ ...prev, categoria_id: response.data.id.toString() }));
      setNewCategoryName('');
      setShowCategoryModal(false);
      toast.success('Categoría creada exitosamente');
    } catch (error: any) {
      console.error('Error al crear categoría:', error);
      toast.error(error.response?.data?.message || 'Error al crear la categoría');
    }
  };

  const handleCreateSeason = async () => {
    if (!newSeasonName.trim()) {
      toast.error('Ingresa un nombre para la temporada');
      return;
    }
    try {
      const api = (await import('../services/api')).default;
      const response = await api.post('/temporadas', { nombre: newSeasonName });
      setTemporadas(prev => [...prev, response.data]);
      setFormData(prev => ({ ...prev, temporada_id: response.data.id.toString() }));
      setNewSeasonName('');
      setShowSeasonModal(false);
      toast.success('Temporada creada exitosamente');
    } catch (error: any) {
      console.error('Error al crear temporada:', error);
      toast.error(error.response?.data?.message || 'Error al crear la temporada');
    }
  };

  // Función no usada - comentada para evitar warning
  // const eliminarVariacion = (index: number) => {
  //   setVariaciones(prev => prev.filter((_, i) => i !== index));
  // };

  // Nuevas funciones para manejo de colores y tallas
  const agregarColorVariacion = () => {
    const nuevoColor: ColorVariacion = {
      color: '',
      codigo_color: '#000000',
      imagenes_urls: [],
      imagenes_files: [],
      tallas: {},
    };
    setColoresVariaciones(prev => [...prev, nuevoColor]);
  };

  const eliminarColorVariacion = (index: number) => {
    setColoresVariaciones(prev => prev.filter((_, i) => i !== index));
  };

  const handleColorChange = (colorIndex: number, field: string, value: string) => {
    setColoresVariaciones(prev => {
      const updated = [...prev];
      updated[colorIndex] = { ...updated[colorIndex], [field]: value };
      return updated;
    });
  };

  const handleColorImageUpload = async (colorIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingImages(true);
      const filesArray = Array.from(files);
      const results = await uploadService.uploadMultipleImages(filesArray);
      
      setColoresVariaciones(prev => {
        const updated = [...prev];
        updated[colorIndex] = { 
          ...updated[colorIndex], 
          imagenes_urls: [...updated[colorIndex].imagenes_urls, ...results], 
          imagenes_files: [...updated[colorIndex].imagenes_files, ...filesArray]
        };
        return updated;
      });
      toast.success(`${results.length} imagen(es) subida(s) exitosamente`);
    } catch (error) {
      console.error('Error al subir imágenes:', error);
      toast.error('Error al subir las imágenes');
    } finally {
      setUploadingImages(false);
      // Reset input para permitir subir las mismas imágenes de nuevo
      e.target.value = '';
    }
  };

  const removeColorImage = (colorIndex: number, imageIndex: number) => {
    setColoresVariaciones(prev => {
      const updated = [...prev];
      updated[colorIndex].imagenes_urls = updated[colorIndex].imagenes_urls.filter((_, i) => i !== imageIndex);
      updated[colorIndex].imagenes_files = updated[colorIndex].imagenes_files.filter((_, i) => i !== imageIndex);
      return updated;
    });
  };

  const handleTallaToggle = (colorIndex: number, talla: string, enabled: boolean) => {
    setColoresVariaciones(prev => {
      const updated = [...prev];
      if (!updated[colorIndex].tallas[talla]) {
        updated[colorIndex].tallas[talla] = { enabled: false, stock: 0, sku: '' };
      }
      updated[colorIndex].tallas[talla].enabled = enabled;
      return updated;
    });
  };

  const handleTallaStockChange = (colorIndex: number, talla: string, stock: number) => {
    setColoresVariaciones(prev => {
      const updated = [...prev];
      if (!updated[colorIndex].tallas[talla]) {
        updated[colorIndex].tallas[talla] = { enabled: true, stock: 0, sku: '' };
      }
      updated[colorIndex].tallas[talla].stock = stock;
      return updated;
    });
  };

  const handleTallaSKUChange = (colorIndex: number, talla: string, sku: string) => {
    setColoresVariaciones(prev => {
      const updated = [...prev];
      if (!updated[colorIndex].tallas[talla]) {
        updated[colorIndex].tallas[talla] = { enabled: true, stock: 0, sku: '' };
      }
      updated[colorIndex].tallas[talla].sku = sku;
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.precio) {
      toast.error('Por favor completa los campos obligatorios');
      return;
    }

    // Convertir coloresVariaciones a variaciones planas
    if (formData.tiene_variaciones) {
      const variacionesPlanas: Variacion[] = [];
      
      for (const colorVar of coloresVariaciones) {
        if (!colorVar.color || !colorVar.codigo_color) {
          toast.error('Completa la información del color');
          return;
        }

        const tallasHabilitadas = Object.entries(colorVar.tallas).filter(
          ([_, data]) => data.enabled
        );

        if (tallasHabilitadas.length === 0) {
          toast.error(`Selecciona al menos una talla para el color ${colorVar.color}`);
          return;
        }

        for (const [talla, data] of tallasHabilitadas) {
          variacionesPlanas.push({
            talla,
            color: colorVar.color,
            codigo_color: colorVar.codigo_color,
            stock: data.stock,
            sku: data.sku,
            imagen_url: colorVar.imagenes_urls?.[0] || '',
            imagen_file: colorVar.imagenes_files?.[0],
          });
        }
      }

      setVariaciones(variacionesPlanas);
    }

    if (formData.tiene_variaciones && coloresVariaciones.length === 0) {
      toast.error('Debes agregar al menos un color con tallas');
      return;
    }

    try {
      setIsSaving(true);

      // 1. Subir imágenes principales del producto
      let imagenesUrls: string[] = [];
      if (imageFiles.length > 0) {
        setUploadingImages(true);
        const uploadPromises = imageFiles.map(file => uploadService.uploadImage(file));
        const results = await Promise.all(uploadPromises);
        imagenesUrls = results.map(r => r.url);
        setUploadingImages(false);
      } else if (isEditMode) {
        // Mantener imágenes existentes
        imagenesUrls = formData.imagenes;
      }

      // 2. Convertir coloresVariaciones a variaciones y procesar
      let variacionesData: any[] = [];
      if (formData.tiene_variaciones) {
        console.log('🎨 Colores variaciones:', coloresVariaciones);
        
        // Crear variaciones planas desde coloresVariaciones
        const variacionesPlanas: Variacion[] = [];
        for (const colorVar of coloresVariaciones) {
          const tallasHabilitadas = Object.entries(colorVar.tallas).filter(
            ([_, data]) => data.enabled
          );
          
          console.log(`📸 Color ${colorVar.color}:`, {
            imagenes_urls: colorVar.imagenes_urls,
            codigo_color: colorVar.codigo_color,
            numTallas: tallasHabilitadas.length
          });
          
          // Distribuir imágenes entre las tallas
          // Si hay múltiples imágenes, cada talla usará una imagen diferente (cíclicamente)
          for (let i = 0; i < tallasHabilitadas.length; i++) {
            const [talla, data] = tallasHabilitadas[i];
            // Usar imagen cíclicamente: si hay 3 imágenes y 4 tallas, repite la primera
            const imageIndex = colorVar.imagenes_urls.length > 0 ? i % colorVar.imagenes_urls.length : 0;
            const imagenUrl = colorVar.imagenes_urls[imageIndex];
            
            variacionesPlanas.push({
              talla,
              color: colorVar.color,
              codigo_color: colorVar.codigo_color,
              stock: data.stock,
              sku: data.sku,
              imagen_url: imagenUrl,
            });
          }
        }

        variacionesData = variacionesPlanas.map((v) => ({
          talla: v.talla || undefined,
          color: v.color || undefined,
          codigo_color: v.codigo_color || undefined,
          imagen_url: v.imagen_url || undefined,
          stock: parseInt(v.stock.toString()) || 0,
          sku: v.sku && v.sku.trim() ? v.sku : undefined, // Solo enviar SKU si tiene valor
        }));
      }

      // 3. Crear/actualizar producto
      const productoData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion || undefined,
        precio: parseFloat(formData.precio),
        imagenes: imagenesUrls.length > 0 ? imagenesUrls : undefined,
        categoria_id: formData.categoria_id ? parseInt(formData.categoria_id) : undefined,
        temporada_id: formData.temporada_id ? parseInt(formData.temporada_id) : undefined,
        genero: formData.genero,
        tiene_variaciones: formData.tiene_variaciones,
        variaciones: formData.tiene_variaciones ? variacionesData : undefined,
      };

      console.log('📦 Datos a enviar:', productoData);
      console.log('🎨 Variaciones:', variacionesData);

      if (isEditMode && id) {
        await productService.update(parseInt(id), productoData);
        toast.success('Producto actualizado exitosamente');
      } else {
        await productService.create(productoData);
        toast.success('Producto creado exitosamente');
      }

      navigate('/admin/products');
    } catch (error: any) {
      console.error('Error al guardar producto:', error);
      toast.error(error.response?.data?.message || 'Error al guardar el producto');
    } finally {
      setIsSaving(false);
      setUploadingImages(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-versyo-cream to-white flex items-center justify-center">
        <div className="text-versyo-primary text-xl">Cargando...</div>
      </div>
    );
  }

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-versyo-cream to-white">
      <Header />
      
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate('/admin/products')}
              className="flex items-center space-x-2 text-versyo-dark hover:text-versyo-primary transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver a Productos</span>
            </button>

            <h1 className="text-3xl md:text-4xl font-bold text-versyo-black">
              {isEditMode ? 'Editar Producto' : 'Agregar Nuevo Producto'}
            </h1>
            <p className="text-versyo-black/70 mt-2">
              {isEditMode ? 'Actualiza la información del producto' : 'Completa los datos del nuevo producto'}
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-card p-8 border border-versyo-mint space-y-8"
          >
            {/* Información Básica */}
            <div>
              <h2 className="text-xl font-bold text-versyo-black mb-4 flex items-center">
                📦 Información Básica
              </h2>
              
              <div className="space-y-6">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-versyo-black mb-2">
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    className="input-modern w-full"
                    placeholder="Ej: Premium Cotton Hoodie"
                  />
                </div>

                {/* Categoría, Temporada, Género y Precio */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-versyo-black mb-2">
                      Categoría (Tipo)
                    </label>
                    <div className="flex gap-2">
                      <select
                        name="categoria_id"
                        value={formData.categoria_id}
                        onChange={handleInputChange}
                        className="input-modern w-full"
                      >
                        <option value="">Sin categoría</option>
                        {categorias.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowCategoryModal(true)}
                        className="px-3 py-2 bg-versyo-primary text-white rounded-lg hover:bg-versyo-hover transition-colors flex-shrink-0"
                        title="Crear nueva categoría"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-versyo-black mb-2">
                      Temporada
                    </label>
                    <div className="flex gap-2">
                      <select
                        name="temporada_id"
                        value={formData.temporada_id}
                        onChange={handleInputChange}
                        className="input-modern w-full"
                      >
                        <option value="">Sin temporada</option>
                        {temporadas.map(temp => (
                          <option key={temp.id} value={temp.id}>{temp.nombre}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowSeasonModal(true)}
                        className="px-3 py-2 bg-versyo-primary text-white rounded-lg hover:bg-versyo-hover transition-colors flex-shrink-0"
                        title="Crear nueva temporada"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-versyo-black mb-2">
                      Género *
                    </label>
                    <select
                      name="genero"
                      value={formData.genero}
                      onChange={handleInputChange}
                      className="input-modern w-full"
                      required
                    >
                      <option value="hombre">Hombre</option>
                      <option value="mujer">Mujer</option>
                      <option value="ambos">Ambos</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-versyo-black mb-2">
                      Precio (S/) *
                    </label>
                    <input
                      type="number"
                      name="precio"
                      value={formData.precio}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      min="0"
                      className="input-modern w-full"
                      placeholder="189.99"
                    />
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-versyo-black mb-2">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows={4}
                    className="input-modern w-full resize-none"
                    placeholder="Describe el producto, materiales, características especiales..."
                  />
                </div>
              </div>
            </div>

            {/* Imágenes del Producto */}
            <div>
              <h2 className="text-xl font-bold text-versyo-black mb-4 flex items-center">
                🖼️ Imágenes del Producto
              </h2>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-versyo-mint">
                      <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  <label className="w-32 h-32 border-2 border-dashed border-versyo-mint rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-versyo-primary transition-colors">
                    <Upload className="w-8 h-8 text-versyo-black/40 mb-2" />
                    <span className="text-xs text-versyo-black/60">Agregar</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500">
                  Puedes subir múltiples imágenes. La primera será la imagen principal.
                </p>
              </div>
            </div>

            {/* Sistema de Variaciones */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-versyo-black flex items-center">
                  🎨 Variaciones
                </h2>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <span className="text-sm font-medium text-versyo-black">
                    ¿Tiene variaciones?
                  </span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.tiene_variaciones}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, tiene_variaciones: e.target.checked }));
                        if (e.target.checked && coloresVariaciones.length === 0) {
                          agregarColorVariacion();
                        }
                      }}
                      className="sr-only"
                    />
                    <div className={`w-14 h-8 rounded-full transition-colors ${formData.tiene_variaciones ? 'bg-versyo-primary' : 'bg-gray-300'}`}>
                      <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${formData.tiene_variaciones ? 'translate-x-7 translate-y-1' : 'translate-x-1 translate-y-1'}`}></div>
                    </div>
                  </div>
                </label>
              </div>

              {formData.tiene_variaciones && (
                <div className="space-y-4">
                  {coloresVariaciones.map((colorVar, colorIndex) => (
                    <div key={colorIndex} className="border-2 border-versyo-mint rounded-lg p-6 space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-versyo-black flex items-center space-x-2">
                          <span className="w-6 h-6 rounded-full border-2 border-gray-300" style={{ backgroundColor: colorVar.codigo_color }}></span>
                          <span>Variación de Color #{colorIndex + 1}</span>
                        </h3>
                        {coloresVariaciones.length > 1 && (
                          <button
                            type="button"
                            onClick={() => eliminarColorVariacion(colorIndex)}
                            className="text-red-600 hover:text-red-800 flex items-center space-x-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="text-sm">Eliminar</span>
                          </button>
                        )}
                      </div>

                      {/* Color y Código */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-versyo-black mb-2">
                            Color *
                          </label>
                          <input
                            type="text"
                            value={colorVar.color}
                            onChange={(e) => handleColorChange(colorIndex, 'color', e.target.value)}
                            className="input-modern w-full"
                            placeholder="Ej: Negro, Azul Marino"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-versyo-black mb-2">
                            Código de Color *
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={colorVar.codigo_color}
                              onChange={(e) => handleColorChange(colorIndex, 'codigo_color', e.target.value)}
                              className="w-12 h-10 rounded border-2 border-versyo-mint cursor-pointer"
                            />
                            <input
                              type="text"
                              value={colorVar.codigo_color}
                              onChange={(e) => handleColorChange(colorIndex, 'codigo_color', e.target.value)}
                              className="input-modern flex-1"
                              placeholder="#000000"
                              maxLength={7}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Imágenes del color */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-versyo-black mb-2">
                          Imágenes de este color
                        </label>
                        
                        {/* Galería de imágenes */}
                        {colorVar.imagenes_urls.length > 0 && (
                          <div className="flex flex-wrap gap-4 mb-4">
                            {colorVar.imagenes_urls.map((url, imgIndex) => (
                              <div key={imgIndex} className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-versyo-mint">
                                <img src={url} alt={`Color ${imgIndex + 1}`} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => removeColorImage(colorIndex, imgIndex)}
                                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Botón para subir imágenes */}
                        <label className="cursor-pointer" htmlFor={`color-image-${colorIndex}`}>
                          <div className="px-4 py-2 bg-versyo-primary text-white rounded-lg hover:bg-versyo-hover transition-colors flex items-center space-x-2 inline-flex">
                            <Upload className="w-4 h-4" />
                            <span>{colorVar.imagenes_urls.length > 0 ? 'Agregar Más' : 'Subir'} Imágenes</span>
                          </div>
                        </label>
                        <input
                          id={`color-image-${colorIndex}`}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleColorImageUpload(colorIndex, e)}
                          className="hidden"
                        />
                      </div>

                      {/* Tallas disponibles */}
                      <div>
                        <label className="block text-sm font-medium text-versyo-black mb-3">
                          Tallas Disponibles
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {availableSizes.map(size => (
                            <div key={size} className="border-2 border-versyo-mint rounded-lg p-3">
                              <label className="flex items-center space-x-3 mb-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={colorVar.tallas[size]?.enabled || false}
                                  onChange={(e) => handleTallaToggle(colorIndex, size, e.target.checked)}
                                  className="w-5 h-5 text-versyo-primary focus:ring-versyo-primary border-gray-300 rounded"
                                />
                                <span className="font-semibold text-versyo-black">{size}</span>
                              </label>
                              
                              {colorVar.tallas[size]?.enabled && (
                                <div className="space-y-2 mt-2 pl-8">
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Stock</label>
                                    <input
                                      type="number"
                                      value={colorVar.tallas[size]?.stock || 0}
                                      onChange={(e) => handleTallaStockChange(colorIndex, size, parseInt(e.target.value) || 0)}
                                      min="0"
                                      className="input-modern w-full text-sm"
                                      placeholder="0"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">SKU (opcional)</label>
                                    <input
                                      type="text"
                                      value={colorVar.tallas[size]?.sku || ''}
                                      onChange={(e) => handleTallaSKUChange(colorIndex, size, e.target.value)}
                                      className="input-modern w-full text-sm"
                                      placeholder="Auto-generado"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={agregarColorVariacion}
                    className="w-full py-3 border-2 border-dashed border-versyo-mint rounded-lg text-versyo-dark hover:border-versyo-primary hover:text-versyo-primary transition-colors flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Agregar Color</span>
                  </button>
                </div>
              )}
            </div>

            {/* Botones de Acción */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-versyo-mint">
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                disabled={isSaving || uploadingImages}
                className="px-6 py-3 border-2 border-versyo-mint text-versyo-dark rounded-lg hover:bg-versyo-light transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving || uploadingImages}
                className="px-6 py-3 bg-versyo-primary text-white rounded-lg hover:bg-versyo-hover transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                <span>
                  {uploadingImages ? 'Subiendo imágenes...' : isSaving ? 'Guardando...' : isEditMode ? 'Actualizar Producto' : 'Crear Producto'}
                </span>
              </button>
            </div>
          </motion.form>
        </div>
      </section>

      <Footer />

      {/* Modal: Crear Categoría */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-versyo-black mb-4">Nueva Categoría</h3>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Ej: Hoodies, Polos, Pants..."
              className="input-modern w-full mb-4"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateCategory()}
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  setNewCategoryName('');
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateCategory}
                className="px-4 py-2 bg-versyo-primary text-white rounded-lg hover:bg-versyo-hover"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Crear Temporada */}
      {showSeasonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-versyo-black mb-4">Nueva Temporada</h3>
            <input
              type="text"
              value={newSeasonName}
              onChange={(e) => setNewSeasonName(e.target.value)}
              placeholder="Ej: Verano 2025, Invierno 2025..."
              className="input-modern w-full mb-4"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateSeason()}
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowSeasonModal(false);
                  setNewSeasonName('');
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateSeason}
                className="px-4 py-2 bg-versyo-primary text-white rounded-lg hover:bg-versyo-hover"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductForm;
