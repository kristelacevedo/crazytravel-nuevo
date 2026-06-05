import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import type { CSSProperties } from 'react';
import { formatRut, validateRut } from '../../lib/validators/rut';
import api from '../../services/api';

// ─── Definición de Tipos ─────────────────────────────────────────────────────
interface FullProfileData {
  first_name: string;
  middle_name?: string;
  last_name: string;
  second_last_name?: string;
  rut: string;
  passport?: string;
  birth_date: string;
  phone: string;
  food_preference: string;
  allergies?: string;
  emergency_name: string;
  emergency_phone: string;
}

interface PersonalDataForm extends FullProfileData {
  has_allergies_radio: 'si' | 'no';
}

const capitalize = (text: string) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export default function PersonalData() {
  const [fetching, setFetching] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [globalMsg, setGlobalMsg] = useState({ type: '', text: '' });

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting }
  } = useForm<PersonalDataForm>({
    defaultValues: { 
      food_preference: 'Ninguna',
      has_allergies_radio: 'no'
    }
  });

  const hasAllergiesRadio = useWatch({
    control,
    name: 'has_allergies_radio',
  });

  // ─── Carga de Datos desde el Backend ────────────────────────────────────────
  useEffect(() => {
    async function loadData() {
      try {
        setFetching(true);
        
        // Intentar obtener datos del backend
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const response = await api.get('/profile');
            const data = response.data;
            
            setValue('first_name', data.first_name || '');
            setValue('middle_name', data.middle_name || '');
            setValue('last_name', data.last_name || '');
            setValue('second_last_name', data.second_last_name || '');
            setValue('rut', data.rut || '');
            setValue('passport', data.passport || '');
            setValue('birth_date', data.birth_date || '');
            
            const cleanPhone = data.phone?.startsWith('9') ? data.phone.slice(1) : data.phone;
            setValue('phone', cleanPhone || '');
            
            setValue('food_preference', data.food_preference || 'Ninguna');
            setValue('allergies', data.allergies || '');
            setValue('emergency_name', data.emergency_name || '');
            
            const cleanEmergencyPhone = data.emergency_phone?.startsWith('9') ? data.emergency_phone.slice(1) : data.emergency_phone;
            setValue('emergency_phone', cleanEmergencyPhone || '');
            
            if (data.allergies && data.allergies.trim() !== '') {
              setValue('has_allergies_radio', 'si');
            } else {
              setValue('has_allergies_radio', 'no');
            }
            setIsEditing(false);
            setFetching(false);
            return;
          } catch (apiErr) {
            console.log('No se pudo obtener del backend, usando localStorage');
          }
        }
        
        // Fallback a localStorage
        const savedProfile = localStorage.getItem('crazy_travel_profile');
        if (savedProfile) {
          const data = JSON.parse(savedProfile) as FullProfileData;
          
          setValue('first_name', data.first_name || '');
          setValue('middle_name', data.middle_name || '');
          setValue('last_name', data.last_name || '');
          setValue('second_last_name', data.second_last_name || '');
          setValue('rut', data.rut || '');
          setValue('passport', data.passport || '');
          setValue('birth_date', data.birth_date || '');
          
          const cleanPhone = data.phone?.startsWith('9') ? data.phone.slice(1) : data.phone;
          setValue('phone', cleanPhone || '');
          
          setValue('food_preference', data.food_preference || 'Ninguna');
          setValue('allergies', data.allergies || '');
          setValue('emergency_name', data.emergency_name || '');
          
          const cleanEmergencyPhone = data.emergency_phone?.startsWith('9') ? data.emergency_phone.slice(1) : data.emergency_phone;
          setValue('emergency_phone', cleanEmergencyPhone || '');
          
          if (data.allergies && data.allergies.trim() !== '') {
            setValue('has_allergies_radio', 'si');
          } else {
            setValue('has_allergies_radio', 'no');
          }
          setIsEditing(false);
        } else {
          setIsEditing(true);
        }
      } catch (err) {
        console.error(err);
        setGlobalMsg({ type: 'error', text: 'No se pudieron descargar tus datos guardados.' });
      } finally {
        setFetching(false);
      }
    }
    loadData();
  }, [setValue]);

  // ─── Guardado en el Backend ──────────────────────────────────────────────────
  const onSubmit = async (formData: PersonalDataForm) => {
    setGlobalMsg({ type: '', text: '' });

    const payload: FullProfileData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone: `9${formData.phone}`,
      middle_name: formData.middle_name || '',
      second_last_name: formData.second_last_name || '',
      rut: formData.rut,
      passport: formData.passport || '',
      birth_date: formData.birth_date,
      food_preference: formData.food_preference || 'Ninguna',
      allergies: formData.has_allergies_radio === 'si' ? formData.allergies : '',
      emergency_name: formData.emergency_name,
      emergency_phone: formData.emergency_phone ? `9${formData.emergency_phone}` : ''
    };
    
    try {
      // Enviar al backend
      const response = await api.put('/profile', payload);
      
      if (response.status === 200) {
        // Guardar también en localStorage como respaldo
        localStorage.setItem('crazy_travel_profile', JSON.stringify(payload));
        setGlobalMsg({ type: 'success', text: '¡Ficha de pasajero actualizada correctamente en el sistema!' });
        setIsEditing(false);
      }
    } catch (err: any) {
      console.error('Error al guardar:', err);
      const errorMsg = err.response?.data?.error || 'Error al procesar y guardar la información.';
      setGlobalMsg({ type: 'error', text: errorMsg });
    }
  };

  if (fetching) {
    return <p style={{ color: '#475569', padding: '20px', textAlign: 'center' }}>⏳ Sincronizando tus antecedentes con Crazy Travel...</p>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
        <h2 style={{ fontSize: '24px', color: '#0f172a', margin: 0 }}>Mis Datos Personales (Ficha Pasajero Frecuente)</h2>
        
        {!isEditing && (
          <button type="button" onClick={() => { setIsEditing(true); setGlobalMsg({ type: '', text: '' }); }} style={editButtonStyle}>
            ✏️ Modificar Información
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: '24px' }}>
        
        {/* --- SECCIÓN 1: IDENTIDAD --- */}
        <div>
          <h3 style={subSectionTitleStyle}>1. Identidad</h3>
          <div style={twoColGrid}>
            <div>
              <label style={labelStyle}>Primer Nombre *</label>
              <input 
                type="text" 
                disabled={!isEditing} 
                style={{ ...inputStyle, ...( !isEditing ? disabledInputStyle : {} ) }} 
                {...register('first_name', { 
                  required: 'El primer nombre es obligatorio',
                  onChange: (e) => {
                    e.target.value = capitalize(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, ''));
                  }
                })} 
              />
              {errors.first_name && <span style={errorTextStyle}>⚠️ {errors.first_name.message}</span>}
            </div>
            <div>
              <label style={labelStyle}>Segundo Nombre</label>
              <input 
                type="text" 
                disabled={!isEditing} 
                style={{ ...inputStyle, ...( !isEditing ? disabledInputStyle : {} ) }} 
                {...register('middle_name', {
                  onChange: (e) => { e.target.value = capitalize(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '')); }
                })} 
              />
            </div>
            <div>
              <label style={labelStyle}>Primer Apellido *</label>
              <input 
                type="text" 
                disabled={!isEditing} 
                style={{ ...inputStyle, ...( !isEditing ? disabledInputStyle : {} ) }} 
                {...register('last_name', { 
                  required: 'El apellido paterno es obligatorio',
                  onChange: (e) => { e.target.value = capitalize(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '')); }
                })} 
              />
              {errors.last_name && <span style={errorTextStyle}>⚠️ {errors.last_name.message}</span>}
            </div>
            <div>
              <label style={labelStyle}>Segundo Apellido</label>
              <input 
                type="text" 
                disabled={!isEditing} 
                style={{ ...inputStyle, ...( !isEditing ? disabledInputStyle : {} ) }} 
                {...register('second_last_name', {
                  onChange: (e) => { e.target.value = capitalize(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '')); }
                })} 
              />
            </div>
            <div>
              <label style={labelStyle}>RUT / Carnet Chileno *</label>
              <input 
                type="text" 
                disabled={!isEditing}
                placeholder="Ej: 12.345.678-9" 
                style={{ ...inputStyle, ...( !isEditing ? disabledInputStyle : {} ) }} 
                {...register('rut', { 
                  required: 'El RUT es obligatorio',
                  validate: (value) => validateRut(value) || 'El RUT ingresado no es válido',
                  onChange: (e) => { e.target.value = formatRut(e.target.value); }
                })} 
              />
              {errors.rut && <span style={errorTextStyle}>⚠️ {errors.rut.message}</span>}
            </div>
            <div>
              <label style={labelStyle}>Pasaporte (Opcional)</label>
              <input type="text" disabled={!isEditing} placeholder="Ej: P123456789" style={{ ...inputStyle, ...( !isEditing ? disabledInputStyle : {} ) }} {...register('passport', { onChange: (e) => { e.target.value = e.target.value.toUpperCase(); } })} />
            </div>
            <div>
              <label style={labelStyle}>Fecha de Nacimiento *</label>
              <input type="date" disabled={!isEditing} style={{ ...inputStyle, ...( !isEditing ? disabledInputStyle : {} ) }} {...register('birth_date', { required: 'La fecha de nacimiento es obligatoria' })} />
              {errors.birth_date && <span style={errorTextStyle}>⚠️ {errors.birth_date.message}</span>}
            </div>
          </div>
        </div>

        <hr style={dividerStyle} />

        {/* --- SECCIÓN 2: CONTACTO Y BIENESTAR --- */}
        <div>
          <h3 style={subSectionTitleStyle}>2. Contacto y Bienestar</h3>
          <div style={twoColGrid}>
            <div>
              <label style={labelStyle}>Tu Teléfono / WhatsApp *</label>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <span style={countryCodeStyle}> Chileno 🇨🇱 +56 9 </span>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  placeholder="1234 5678" 
                  style={{ ...inputStyle, flex: 1, ...( !isEditing ? disabledInputStyle : {} ) }} 
                  {...register('phone', { 
                    required: 'El teléfono celular es obligatorio',
                    pattern: { value: /^[0-9]{8}$/, message: 'Deben ser exactamente los 8 números restantes' },
                    onChange: (e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ''); }
                  })} 
                />
              </div>
              {errors.phone && <span style={errorTextStyle}>⚠️ {errors.phone.message}</span>}
            </div>
            <div>
              <label style={labelStyle}>Preferencia Alimenticia</label>
              <select disabled={!isEditing} style={{ ...inputStyle, ...( !isEditing ? disabledInputStyle : {} ) }} {...register('food_preference')}>
                <option value="Ninguna">Estándar (Sin restricciones)</option>
                <option value="Vegetariano">Vegetariano</option>
                <option value="Vegano">Vegano</option>
                <option value="Celiaco">Libre de Gluten (Celiaco)</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <label style={labelStyle}>¿Posee alguna Alergia o Condición Médica? *</label>
            <div style={{ display: 'flex', gap: '24px', margin: '8px 0' }}>
              <label style={{ display: 'flex', gap: '8px', cursor: isEditing ? 'pointer' : 'not-allowed' }}>
                <input type="radio" value="si" disabled={!isEditing} {...register('has_allergies_radio')} /> Sí, tengo
              </label>
              <label style={{ display: 'flex', gap: '8px', cursor: isEditing ? 'pointer' : 'not-allowed' }}>
                <input type="radio" value="no" disabled={!isEditing} {...register('has_allergies_radio')} onClick={() => setValue('allergies', '')} /> No, ninguna
              </label>
            </div>

            {hasAllergiesRadio === 'si' && (
              <div style={{ marginTop: '12px' }}>
                <label style={labelStyle}>Detalle de Alergias / Condiciones Médicas *</label>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  placeholder="Ej: Alergia severa a los mariscos, asma crónica, etc." 
                  style={{ ...inputStyle, ...( !isEditing ? disabledInputStyle : {} ) }} 
                  {...register('allergies', { required: 'Si posee condiciones, debe detallarlas para los paramédicos del tour' })} 
                />
                {errors.allergies && <span style={errorTextStyle}>⚠️ {errors.allergies.message}</span>}
              </div>
            )}
          </div>
        </div>

        <hr style={dividerStyle} />

        {/* --- SECCIÓN 3: EMERGENCIA --- */}
        <div>
          <h3 style={subSectionTitleStyle}>3. Contacto de Emergencia</h3>
          <div style={twoColGrid}>
            <div>
              <label style={labelStyle}>Nombre del Contacto *</label>
              <input type="text" disabled={!isEditing} placeholder="Ej: María Veliz (Madre)" style={{ ...inputStyle, ...( !isEditing ? disabledInputStyle : {} ) }} {...register('emergency_name', { required: 'El nombre de emergencia es requerido' })} />
              {errors.emergency_name && <span style={errorTextStyle}>⚠️ {errors.emergency_name.message}</span>}
            </div>
            <div>
              <label style={labelStyle}>Teléfono de Emergencia *</label>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <span style={countryCodeStyle}>🇨🇱 +56 9</span>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  placeholder="1234 5678" 
                  style={{ ...inputStyle, flex: 1, ...( !isEditing ? disabledInputStyle : {} ) }} 
                  {...register('emergency_phone', { 
                    required: 'El teléfono de emergencia es obligatorio',
                    pattern: { value: /^[0-9]{8}$/, message: 'Deben ser exactamente los 8 números restantes' },
                    onChange: (e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ''); }
                  })} 
                />
              </div>
              {errors.emergency_phone && <span style={errorTextStyle}>⚠️ {errors.emergency_phone.message}</span>}
            </div>
          </div>
        </div>

        {globalMsg.text && (
          <div style={globalMsg.type === 'success' ? successAlertStyle : errorAlertStyle}>
            {globalMsg.text}
          </div>
        )}
        
        {isEditing && (
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button type="button" onClick={() => { setIsEditing(false); setGlobalMsg({ type: '', text: '' }); }} style={{ ...buttonStyle, background: '#64748b' }}>
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} style={buttonStyle}>
              {isSubmitting ? 'Guardando...' : 'Guardar Ficha'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────
const subSectionTitleStyle: CSSProperties = { fontSize: '18px', color: '#0f766e', marginBottom: '16px', fontWeight: 'bold' };
const dividerStyle: CSSProperties = { border: 'none', borderTop: '1px solid #e2e8f0', margin: '0' };
const twoColGrid: CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' };
const labelStyle: CSSProperties = { display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: '#1e293b' };
const inputStyle: CSSProperties = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box', fontSize: '15px', backgroundColor: '#fff', color: '#0f172a' };
const disabledInputStyle: CSSProperties = { backgroundColor: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', cursor: 'not-allowed' };
const countryCodeStyle: CSSProperties = { padding: '12px', backgroundColor: '#e2e8f0', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#334155', fontWeight: 'bold', fontSize: '14px' };
const buttonStyle: CSSProperties = { padding: '14px 24px', borderRadius: '8px', border: 'none', background: '#0f766e', color: '#fff', cursor: 'pointer', fontWeight: '600', fontSize: '15px' };
const editButtonStyle: CSSProperties = { padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f766e', cursor: 'pointer', fontWeight: '600', fontSize: '14px' };
const errorTextStyle: CSSProperties = { color: '#dc2626', fontSize: '12px', marginTop: '4px', display: 'block', fontWeight: '500' };
const successAlertStyle: CSSProperties = { padding: '12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#16a34a', fontSize: '14px', marginTop: '16px' };
const errorAlertStyle: CSSProperties = { padding: '12px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', color: '#dc2626', fontSize: '14px', marginTop: '16px' };