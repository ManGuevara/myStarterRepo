--Insert new record into account table--
INSERT INTO public.account (
	account_firstname,
	account_lastname,
	account_email,
	account_password
)
VALUES 
('Tony',
'Stark',
'tony@starkent.com',
'Iam1ronM@n');

--UPDATE tony Stark ccount_type to Admin--
UPDATE public.account
SET account_type = 'Admin'::account_type
WHERE account_email = 'tony@starkent.com';

--DELETE record tony stark from database--
DELETE FROM public.account
WHERE account_id = 1;


--Modify the "GM HUmmer" record to read "a huge interior" rather than "small interiors"--
UPDATE
	inventory
SET
	inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior');


--INNER JOIN query--

SELECT 
    inventory.inv_make,
    inventory.inv_model,
    classification.classification_name
FROM 
    public.inventory
INNER JOIN 
    public.classification ON inventory.classification_id = classification.classification_id
WHERE 
    classification.classification_name = 'Sport';

-- add "/vehicles" to the middle of the file path in the inv_image and inv_thumbnail --

UPDATE public.inventory
SET 
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');