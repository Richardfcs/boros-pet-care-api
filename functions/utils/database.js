import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("As variáveis de ambiente SUPABASE_URL e SUPABASE_KEY devem ser definidas.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export class Database {

    async select(table, search) {
        let query = supabase.from(table).select('*');

        if (search) {
            if (search.name) {
                query = query.ilike('name', `%${search.name}%`);
            }
            if (search.email) {
                query = query.eq('email', search.email);
            }
        }

        const { data, error } = await query;

        if (error) {
            console.error("Erro no select (Supabase):", error);
            return [];
        }
        return data;
    }

    async insert(table, data) {
        const { data: insertedData, error } = await supabase.from(table).insert([data]).select();

        if (error) {
            console.error("Erro no insert (Supabase):", error);
            return null;
        }
        return insertedData[0];
    }

    async update(table, id, data) {
        const { error } = await supabase
            .from(table)
            .update(data)
            .eq('id', id);

        if (error) {
            console.error("Erro no update (Supabase):", error);
            return false;
        }
        return true;
    }

    async delete(table, id) {
        const { error } = await supabase
            .from(table)
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Erro no delete (Supabase):", error);
            return false;
        }
        return true;
    }


    async findUserByEmail(table, email) {
        const { data, error } = await supabase
            .from(table)
            .select("*")
            .eq('email', email)
            .single();


        if (error) {
            console.error("Erro em findUserByEmail (Supabase):", error);
            return null;
        }

        return data;
    }
}