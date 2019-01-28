<?php
// Validate errors and save to database

function validateAndSave($value, $request, $array) {
    $validator = Validator::make($request->all(), $array);

    if ($validator->fails()) {
        return response([
            "errors" => $validator->getMessageBag()->toArray()
        ], 422);

    } else {

        foreach ($array as $item) {
            $value->$item = $request->$item;
        }

        if ($request->password !== null) {
            $value->password = bcrypt($request->password);
        }

        $value->save();
    }
}

// Check if exists and remove file

function checkRemoveFile($value, $folder) {

    if ($value) {
    	$path = public_path() . '/storage/' . $folder . '/' . $value;
    	if (file_exists($path))
        unlink($path);
    }
}

// Upload Image

function uploadImage($value, $folder, $request) {

    if ($request->hasFile('image')) {
        $file = $request->file('image');
        $name = "avatar_" . $request->username . '.' . $file->getClientOriginalExtension();

        Storage::putFileAs('public/' . $folder, $file, $name);

        $value->image = $name;
        $value->save();
    }
}


//function uploadFiles($value, $folder, $request) {
//
//	if ($request->hasFile('image')) {
//		$file = $request->file('image');
//		$name = "avatar_" . $request->username . '.' . $file->getClientOriginalExtension();
//
//		Storage::putFileAs('public/' . $folder, $file, $name);
//
//		$value->image = $name;
//		$value->save();
//	}
//}
