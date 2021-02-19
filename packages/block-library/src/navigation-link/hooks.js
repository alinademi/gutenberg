/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { category, page, postTitle, tag } from '@wordpress/icons';
import { __, sprintf } from '@wordpress/i18n';

const ICON_MAP = {
	category,
	page,
	post: postTitle,
	tag,
	//TODO: add a generic CPT icon, remember to ask folks for a new icon
};

function enhanceNavigationLinkVariations( settings, name ) {
	if ( name !== 'core/navigation-link' ) {
		return settings;
	}

	if ( settings?.variations ) {
		const variations = settings.variations.map( ( variation ) => {
			return {
				...variation,
				...( ! variation.icon &&
					ICON_MAP[ variation.name ] && {
						icon: ICON_MAP[ variation.name ],
					} ),
				...( ! variation.isActive && {
					isActive: ( blockAttributes, variationAttributes ) => {
						return (
							blockAttributes.type === variationAttributes.type
						);
					},
				} ),
				...( ! variation.title && {
					title: sprintf(
						// translators: the entity (post, page, category, tag, etc)
						__( '%s Link' ),
						variation.singular
					),
				} ),
				...( ! variation.description && {
					description: sprintf(
						// translators: the entity (post, page, category, tag, etc)
						__( 'A link to a %s' ),
						variation.singular
					),
				} ),
			};
		} );
		return {
			...settings,
			variations,
		};
	}
	return settings;
}

addFilter(
	'blocks.registerBlockType',
	'core/navigation-link',
	enhanceNavigationLinkVariations
);
