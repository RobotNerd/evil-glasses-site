import { defineParams } from '@sveltejs/kit/params';

export const params = defineParams({
	/** A content slug: lowercase words joined by hyphens. Old title-style URLs don't match. */
	slug: (param) => (/^[a-z0-9]+(-[a-z0-9]+)*$/.test(param) ? param : undefined)
});
