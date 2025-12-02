import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://drxptgzwykeouijfoecg.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export { supabase }

// import { createClient } from '@supabase/supabase-js'
// import { Database } from './database.types'

// const supabase = createClient<Database>(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_ANON_KEY
// )