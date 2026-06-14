export const ApiEndpoints = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
  },
  resources:  {
  BASE: '/resource',
  ADD_VALUES: (resourceId: number) => `/resource/${resourceId}/values`,
  UPDATE_VALUE: (resourceId: number, valueId: number) => `/resource/${resourceId}/values/${valueId}`,
  REMOVE_VALUE: (resourceId: number, valueId: number) => `/resource/${resourceId}/values/${valueId}`,
  GET_VALUES: (resourceId: number) => `/resource/${resourceId}/values`,
},
  items: {
  BASE: '/items',
  CREATE: '/items',
  UPDATE: (id: number) => `/items/${id}`,
  DELETE: (id: number) => `/items/${id}`,
  GET_BY_ID: (id: number) => `/items/${id}`,
  GET_ALL: (templateId?: number) => 
    templateId ? `/items?templateId=${templateId}` : '/items',
},
  itemSets: {
  BASE: '/itemsets',
  CREATE: '/itemsets',
  UPDATE: (id: number) => `/itemsets/${id}`,
  DELETE: (id: number) => `/itemsets/${id}`,
  ADD_ITEM: (setId: number, itemId: number) => `/itemsets/${setId}/items/${itemId}`,
  REMOVE_ITEM: (setId: number, itemId: number) => `/itemsets/${setId}/items/${itemId}`,
  GET_ALL: '/itemsets',
  GET_PUBLIC: '/itemsets/public',
  GET_BY_ID: (id: number) => `/itemsets/${id}`,
  CHECK_OWNERSHIP: (id: number) => `/itemsets/${id}/ownership`,
},
  media: {
  BASE: '/media',
  CREATE: '/media',
  UPLOAD: '/media/upload',
  EDIT: (id: number) => `/media/${id}`,
  DELETE: (mediaId: number) => `/media/${mediaId}`,
  GET_BY_ITEM: (itemId: number) => `/media/item/${itemId}`,
  DOWNLOAD: (mediaId: number) => `/media/download/${mediaId}`,
  GET_BY_MIME_TYPE: (mimetype: string) => `/media/by-mimetype?mimetype=${encodeURIComponent(mimetype)}`,
  GET_BY_OWNER: (ownerId: string) => `/media/by-owner/${ownerId}`,
  GET_METADATA: (mediaId: number) => `/media/metadata/${mediaId}`,
   },
  resourceTemplates:  {
  BASE: '/resourcetemplate',
  CREATE: '/resourcetemplate', // Requires Auth
  GET_BY_ID: (id: number) => `/resourcetemplate/${id}`, // Public
  UPDATE: (id: number) => `/resourcetemplate/${id}`, // Requires Auth
  DELETE: (id: number) => `/resourcetemplate/${id}`, // Requires Auth
  ADD_PROPERTIES: (templateId: number) => `/resourcetemplate/${templateId}/properties`, // Requires Auth
  UPDATE_PROPERTY: (templateId: number, propertyId: number) => `/resourcetemplate/${templateId}/properties/${propertyId}`, // Requires Auth
  REMOVE_PROPERTY: (templateId: number, propertyId: number) => `/resourcetemplate/${templateId}/properties/${propertyId}`, // Requires Auth
},
  vocabularies: {
  BASE: '/vocabularies',
  GET_ALL: '/vocabularies', // Public
  GET_BY_ID: (id: number) => `/vocabularies/${id}`, // Public
  GET_BY_PREFIX: (prefix: string) => `/vocabularies/by-prefix?prefix=${encodeURIComponent(prefix)}`, // Public
  CREATE: '/vocabularies', // Admin Only
  UPDATE: (id: number) => `/vocabularies/${id}`, // Admin Only
  DELETE: (id: number) => `/vocabularies/${id}`, // Admin Only
  CREATE_PROPERTY: (vocabularyId: number) => `/vocabularies/${vocabularyId}/properties`, // Admin Only
  UPDATE_PROPERTY: (propertyId: number) => `/vocabularies/properties/${propertyId}`, // Admin Only
  DELETE_PROPERTY: (propertyId: number) => `/vocabularies/properties/${propertyId}`, // Admin Only
   },
  User:{
  BASE: '/users',
  GET_ALL: '/users',
  GET_BY_ROLE: (role: string) => `/users/by-role?role=${encodeURIComponent(role)}`,
  GET_BY_ID: (id: string) => `/users/${id}`,
  PROMOTE_TO_LIBRARIAN: (id: string) => `/users/${id}/promote-librarian`,
  DEMOTE_TO_MEMBER: (id: string) => `/users/${id}/demote-member`,
  DEACTIVATE: (id: string) => `/users/${id}/deactivate`,
  REACTIVATE: (id: string) => `/users/${id}/reactivate`,
}
} as const;

export type ApiEndpointGroup = keyof typeof ApiEndpoints;
