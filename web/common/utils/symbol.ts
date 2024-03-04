const hasSymbol = typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol";
export const PolySymbol = (name: string) => hasSymbol ? Symbol(name) : name;

export const serviceStorageKey = PolySymbol("ssk");
export const httpClientKey = PolySymbol("hck");
export const configKey = PolySymbol("config");

export const editingSelectedTagsKey = PolySymbol("editingSelectedTags");
export const selectedTagsKey = PolySymbol("selectedTags");
export const gameCategoriesKey = PolySymbol("gameCategories");
export const rankingKey = PolySymbol("ranking");

export const eventBusKey = PolySymbol("eventBus");
