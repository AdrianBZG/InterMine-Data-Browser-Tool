import { customAlphabet } from 'nanoid'
import dictionary from 'nanoid-dictionary'

export const generateId = customAlphabet(dictionary.nolookalikes, 10)
