
import { supabase } from "@/integrations/supabase/client";
import type { User, Jump } from "./models";

// Copilots
export const getCopilots = async () => {
  const { data, error } = await supabase
    .from('copilots')
    .select('*');
  
  if (error) throw error;
  return data;
};

export const createCopilot = async (copilot: Omit<User, 'id' | 'createdAt'>) => {
  const { data, error } = await supabase
    .from('copilots')
    .insert([copilot])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateCopilot = async (id: string, copilot: Partial<User>) => {
  const { data, error } = await supabase
    .from('copilots')
    .update(copilot)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteCopilot = async (id: string) => {
  const { error } = await supabase
    .from('copilots')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Jumps
export const getJumps = async () => {
  const { data, error } = await supabase
    .from('jumps')
    .select('*');
  
  if (error) throw error;
  return data;
};

export const createJump = async (jump: Omit<Jump, 'id' | 'createdAt' | 'updatedAt'>) => {
  const { data, error } = await supabase
    .from('jumps')
    .insert([jump])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateJump = async (id: string, jump: Partial<Jump>) => {
  const { data, error } = await supabase
    .from('jumps')
    .update(jump)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteJump = async (id: string) => {
  const { error } = await supabase
    .from('jumps')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

export const exportJumps = async () => {
  const jumps = await getJumps();
  const jsonData = JSON.stringify(jumps, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `jumps-export-${new Date().toISOString()}.json`);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
};

export const exportCopilots = async () => {
  const copilots = await getCopilots();
  const jsonData = JSON.stringify(copilots, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `copilots-export-${new Date().toISOString()}.json`);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
};
