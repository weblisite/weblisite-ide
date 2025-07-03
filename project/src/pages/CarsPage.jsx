
              <button
                onClick={() => setFilters({ category: '', priceRange: '', transmission: '' })}
                className="btn btn-primary"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CarsPage;
