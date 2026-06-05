<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\User;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->items()->orderBy('order')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'note'     => 'nullable|string|max:255',
            'quantity' => 'required|integer|min:1',
            'packed'   => 'boolean',
        ]);

        $validated['order'] = $request->user()->items()->max('order') + 1;

        $item = $request->user()->items()->create($validated);

        return response()->json($item, 201);
    }

    public function show(Request $request, Item $item)
    {
        $this->authorize($request->user(), $item);
        return $item;
    }

    public function update(Request $request, Item $item)
    {
        $this->authorize($request->user(), $item);

        $validated = $request->validate([
            'name'     => 'sometimes|string|max:255',
            'quantity' => 'sometimes|integer|min:1',
            'packed'   => 'sometimes|boolean',
            'note'     => 'sometimes|nullable|string|max:255',
        ]);

        $item->update($validated);

        return response()->json($item);
    }

    public function destroy(Request $request, Item $item)
    {
        $this->authorize($request->user(), $item);
        $item->delete();

        return response()->json(null, 204);
    }

    private function authorize(User $user, Item $item): void
    {
        if ($item->user_id !== $user->id) {
            abort(403, 'Unauthorized.');
        }
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'items'   => 'required|array',
            'items.*' => 'integer|exists:items,id',
        ]);

        foreach ($request->items as $order => $id) {
            Item::where('id', $id)
                ->where('user_id', $request->user()->id)
                ->update(['order' => $order]);
        }

        return response()->json(['message' => 'Reordered.']);
    }
}
