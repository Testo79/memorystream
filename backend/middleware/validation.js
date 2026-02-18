// Bounding box validation middleware
export const validateBoundingBox = (req, res, next) => {
    const { minLat, minLng, maxLat, maxLng } = req.query;

    // Check if all parameters are provided
    if (!minLat || !minLng || !maxLat || !maxLng) {
        return res.status(400).json({
            error: 'Missing bounding box parameters',
            message: 'All parameters are required: minLat, minLng, maxLat, maxLng'
        });
    }

    // Parse to numbers
    const bbox = {
        minLat: parseFloat(minLat),
        minLng: parseFloat(minLng),
        maxLat: parseFloat(maxLat),
        maxLng: parseFloat(maxLng)
    };

    // Validate that values are numbers
    if (Object.values(bbox).some(val => isNaN(val))) {
        return res.status(400).json({
            error: 'Invalid bounding box parameters',
            message: 'All parameters must be valid numbers'
        });
    }

    // Validate latitude range [-90, 90]
    if (bbox.minLat < -90 || bbox.minLat > 90 || bbox.maxLat < -90 || bbox.maxLat > 90) {
        return res.status(400).json({
            error: 'Invalid latitude values',
            message: 'Latitude must be between -90 and 90'
        });
    }

    // Validate longitude range [-180, 180]
    if (bbox.minLng < -180 || bbox.minLng > 180 || bbox.maxLng < -180 || bbox.maxLng > 180) {
        return res.status(400).json({
            error: 'Invalid longitude values',
            message: 'Longitude must be between -180 and 180'
        });
    }

    // Validate min < max
    if (bbox.minLat >= bbox.maxLat) {
        return res.status(400).json({
            error: 'Invalid latitude range',
            message: 'minLat must be less than maxLat'
        });
    }

    if (bbox.minLng >= bbox.maxLng) {
        return res.status(400).json({
            error: 'Invalid longitude range',
            message: 'minLng must be less than maxLng'
        });
    }

    // Attach validated bbox to request
    req.bbox = bbox;
    next();
};

const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;

export const validateCreatePlaceBody = (req, res, next) => {
    const { name, lat, lng } = req.body || {};

    if (!isNonEmptyString(name) || name.trim().length > 200) {
        return res.status(400).json({
            error: 'Validation error',
            message: 'Place name is required (max 200 chars)'
        });
    }

    if (typeof lat !== 'number' || Number.isNaN(lat) || lat < -90 || lat > 90) {
        return res.status(400).json({
            error: 'Validation error',
            message: 'Valid latitude (-90 to 90) is required'
        });
    }

    if (typeof lng !== 'number' || Number.isNaN(lng) || lng < -180 || lng > 180) {
        return res.status(400).json({
            error: 'Validation error',
            message: 'Valid longitude (-180 to 180) is required'
        });
    }

    req.body.name = name.trim();
    next();
};

export const validateCreateStoryBody = (req, res, next) => {
    const { placeId, title, content } = req.body || {};

    if (!isNonEmptyString(placeId) || placeId.trim().length > 100) {
        return res.status(400).json({
            error: 'Validation error',
            message: 'Place ID is required'
        });
    }

    if (!isNonEmptyString(title) || title.trim().length > 200) {
        return res.status(400).json({
            error: 'Validation error',
            message: 'Story title is required (max 200 chars)'
        });
    }

    // Pragmatic size limit to avoid very large payloads
    if (!isNonEmptyString(content) || content.trim().length > 5000) {
        return res.status(400).json({
            error: 'Validation error',
            message: 'Story content is required (max 5000 chars)'
        });
    }

    req.body.placeId = placeId.trim();
    req.body.title = title.trim();
    req.body.content = content.trim();
    next();
};
