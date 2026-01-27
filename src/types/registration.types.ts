export interface DoctorRegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  cpf: string;
  crm: string;
  specialty: string;
  phone: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface PatientRegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
  photo?: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  hasInsurance: boolean;
  insuranceName?: string;
}
