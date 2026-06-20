export interface CreatePropertyDto {
  label: string;
  termUri: string;
  localName: string;
}

export interface PropertyDto {
  id: number | string;
  label: string;
  uri: string;
}

export interface UpdatePropertyDto {
  id: number | string;
  label: string;
  uri: string;
}

export interface CreateVocabularyDto {
  prefix: string;
  namespaceUri: string;
  label: string;
  properties?: CreatePropertyDto[];
}

export interface UpdateVocabularyDto {
  id: number | string;
  prefix: string;
  namespaceUri: string;
  label: string;
  properties?: CreatePropertyDto[];
}

export interface VocabularyDto {
  id: number | string;
  prefix: string;
  namespaceUri: string;
  label: string;
  properties: PropertyDto[];
}