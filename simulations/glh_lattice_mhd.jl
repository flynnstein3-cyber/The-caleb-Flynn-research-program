##############################
# GLH × Lattice × MHD (Julia)
# Incompressible resistive MHD
##############################

using LinearAlgebra

##########
# Params #
##########

struct Params
    Nx::Int
    Ny::Int
    Nz::Int
    dx::Float64
    dt::Float64
    nsteps::Int
    log_interval::Int
    a::Float64
    b::Float64
    κ::Float64
    γ::Float64
    Γ::Float64
    η0::Float64
    η1::Float64
    α::Float64
end

############
# Lattice  #
############

struct Lattice
    Nx::Int
    Ny::Int
    Nz::Int
    dx::Float64
    boundary_cells::Vector{CartesianIndex}
end

function make_lattice(p::Params)
    boundary = CartesianIndex[]
    # Example: mark z-boundaries as boundary layer
    for i in 1:p.Nx, j in 1:p.Ny
        push!(boundary, CartesianIndex(i, j, 1))
        push!(boundary, CartesianIndex(i, j, p.Nz))
    end
    return Lattice(p.Nx, p.Ny, p.Nz, p.dx, boundary)
end

############
# Fields   #
############

struct GLHField
    phi::Array{Float64,3}
end

struct MagneticField
    Bx::Array{Float64,3}
    By::Array{Float64,3}
    Bz::Array{Float64,3}
end

struct VelocityField
    vx::Array{Float64,3}
    vy::Array{Float64,3}
    vz::Array{Float64,3}
end

struct Fields
    phi::GLHField
    B::MagneticField
    v::VelocityField
end

#########################
# Discrete operators    #
#########################

function grad(phi::GLHField, lat::Lattice)
    Nx, Ny, Nz = lat.Nx, lat.Ny, lat.Nz
    dx = lat.dx
    gx = zeros(Nx, Ny, Nz)
    gy = zeros(Nx, Ny, Nz)
    gz = zeros(Nx, Ny, Nz)

    @inbounds for i in 2:Nx-1, j in 2:Ny-1, k in 2:Nz-1
        gx[i,j,k] = (phi.phi[i+1,j,k] - phi.phi[i-1,j,k]) / (2dx)
        gy[i,j,k] = (phi.phi[i,j+1,k] - phi.phi[i,j-1,k]) / (2dx)
        gz[i,j,k] = (phi.phi[i,j,k+1] - phi.phi[i,j,k-1]) / (2dx)
    end
    return gx, gy, gz
end

function laplacian(arr::Array{Float64,3}, lat::Lattice)
    Nx, Ny, Nz = lat.Nx, lat.Ny, lat.Nz
    dx = lat.dx
    lap = zeros(Nx, Ny, Nz)

    @inbounds for i in 2:Nx-1, j in 2:Ny-1, k in 2:Nz-1
        lap[i,j,k] = (
            arr[i+1,j,k] + arr[i-1,j,k] +
            arr[i,j+1,k] + arr[i,j-1,k] +
            arr[i,j,k+1] + arr[i,j,k-1] -
            6arr[i,j,k]
        ) / dx^2
    end
    return lap
end

function curl(B::MagneticField, lat::Lattice)
    Nx, Ny, Nz = lat.Nx, lat.Ny, lat.Nz
    dx = lat.dx
    cx = zeros(Nx, Ny, Nz)
    cy = zeros(Nx, Ny, Nz)
    cz = zeros(Nx, Ny, Nz)

    @inbounds for i in 2:Nx-1, j in 2:Ny-1, k in 2:Nz-1
        cx[i,j,k] = (B.Bz[i,j+1,k] - B.Bz[i,j-1,k])/(2dx) -
                    (B.By[i,j,k+1] - B.By[i,j,k-1])/(2dx)
        cy[i,j,k] = (B.Bx[i,j,k+1] - B.Bx[i,j,k-1])/(2dx) -
                    (B.Bz[i+1,j,k] - B.Bz[i-1,j,k])/(2dx)
        cz[i,j,k] = (B.By[i+1,j,k] - B.By[i-1,j,k])/(2dx) -
                    (B.Bx[i,j+1,k] - B.Bx[i,j-1,k])/(2dx)
    end
    return cx, cy, cz
end

function div(B::MagneticField, lat::Lattice)
    Nx, Ny, Nz = lat.Nx, lat.Ny, lat.Nz
    dx = lat.dx
    d = zeros(Nx, Ny, Nz)

    @inbounds for i in 2:Nx-1, j in 2:Ny-1, k in 2:Nz-1
        d[i,j,k] = (B.Bx[i+1,j,k] - B.Bx[i-1,j,k] +
                    B.By[i,j+1,k] - B.By[i,j-1,k] +
                    B.Bz[i,j,k+1] - B.Bz[i,j,k-1]) / (2dx)
    end
    return d
end

#########################
# GLH & MHD physics     #
#########################

# Resistivity
η(phi_array, p::Params) = p.η0 .+ p.η1 .* (phi_array.^2)

# δF/δφ
function δFδφ(phi::GLHField, B::MagneticField, lat::Lattice, p::Params)
    lap_phi = laplacian(phi.phi, lat)
    B2 = B.Bx.^2 .+ B.By.^2 .+ B.Bz.^2
    return p.a .* phi.phi .+ p.b .* (phi.phi.^3) .- p.κ .* lap_phi .+ p.γ .* (phi.phi .* B2)
end

# Source term S = α ∇φ
function S(phi::GLHField, lat::Lattice, p::Params)
    gx, gy, gz = grad(phi, lat)
    return p.α .* gx, p.α .* gy, p.α .* gz
end

# v × B
function v_cross_B(v::VelocityField, B::MagneticField, lat::Lattice)
    Nx, Ny, Nz = lat.Nx, lat.Ny, lat.Nz
    cx = zeros(Nx, Ny, Nz)
    cy = zeros(Nx, Ny, Nz)
    cz = zeros(Nx, Ny, Nz)

    @inbounds for i in 1:Nx, j in 1:Ny, k in 1:Nz
        cx[i,j,k] = v.vy[i,j,k]*B.Bz[i,j,k] - v.vz[i,j,k]*B.By[i,j,k]
        cy[i,j,k] = v.vz[i,j,k]*B.Bx[i,j,k] - v.vx[i,j,k]*B.Bz[i,j,k]
        cz[i,j,k] = v.vx[i,j,k]*B.By[i,j,k] - v.vy[i,j,k]*B.Bx[i,j,k]
    end
    return cx, cy, cz
end

# curl(η curl B)
function curl_resistive(B::MagneticField, ηeff::Array{Float64,3}, lat::Lattice)
    Nx, Ny, Nz = lat.Nx, lat.Ny, lat.Nz
    dx = lat.dx

    cBx, cBy, cBz = curl(B, lat)
    Rx = zeros(Nx, Ny, Nz)
    Ry = zeros(Nx, Ny, Nz)
    Rz = zeros(Nx, Ny, Nz)

    @inbounds for i in 2:Nx-1, j in 2:Ny-1, k in 2:Nz-1
        # curl(η curl B) ~ curl(η * C)
        ηxp = ηeff[i+1,j,k]; ηxm = ηeff[i-1,j,k]
        ηyp = ηeff[i,j+1,k]; ηym = ηeff[i,j-1,k]
        ηzp = ηeff[i,j,k+1]; ηzm = ηeff[i,j,k-1]

        Rx[i,j,k] = ((ηzp*cBz[i,j+1,k] - ηzm*cBz[i,j-1,k]) -
                     (ηyp*cBy[i,j,k+1] - ηym*cBy[i,j,k-1])) / (2dx)
        Ry[i,j,k] = ((ηxp*cBx[i,j,k+1] - ηxm*cBx[i,j,k-1]) -
                     (ηzp*cBz[i+1,j,k] - ηzm*cBz[i-1,j,k])) / (2dx)
        Rz[i,j,k] = ((ηyp*cBy[i+1,j,k] - ηym*cBy[i-1,j,k]) -
                     (ηxp*cBx[i,j+1,k] - ηxm*cBx[i,j-1,k])) / (2dx)
    end
    return Rx, Ry, Rz
end

# GLH update
function update_phi!(phi::GLHField, B::MagneticField, lat::Lattice, p::Params)
    gF = δFδφ(phi, B, lat, p)
    phi.phi .-= p.dt * p.Γ .* gF
end

# MHD update
function update_B!(B::MagneticField, v::VelocityField,
                   phi::GLHField, lat::Lattice, p::Params)
    vxB_x, vxB_y, vxB_z = v_cross_B(v, B, lat)
    Cx, Cy, Cz = curl(MagneticField(vxB_x, vxB_y, vxB_z), lat)

    ηeff = η(phi.phi, p)
    Dx, Dy, Dz = curl_resistive(B, ηeff, lat)
    Sx, Sy, Sz = S(phi, lat, p)

    B.Bx .+= p.dt .* (Cx .- Dx .+ Sx)
    B.By .+= p.dt .* (Cy .- Dy .+ Sy)
    B.Bz .+= p.dt .* (Cz .- Dz .+ Sz)
end

##############################
# Boundary layer correction  #
##############################

function boundary_layer_correction!(B::MagneticField, lat::Lattice, p::Params)
    # Simple damping at boundaries (placeholder for external fluid match)
    @inbounds for idx in lat.boundary_cells
        i,j,k = Tuple(idx)
        B.Bx[i,j,k] *= 0.9
        B.By[i,j,k] *= 0.9
        B.Bz[i,j,k] *= 0.9
    end
end

##############################
# Initialization             #
##############################

function init_fields(p::Params, lat::Lattice)
    Nx, Ny, Nz = p.Nx, p.Ny, p.Nz

    # GLH domain wall in z
    phi_arr = zeros(Nx, Ny, Nz)
    zmid = Nz/2
    @inbounds for i in 1:Nx, j in 1:Ny, k in 1:Nz
        z = (k - zmid) / Nz
        phi_arr[i,j,k] = tanh(10z)  # sharp-ish domain wall
    end
    phi = GLHField(phi_arr)

    # Uniform B in y + small noise
    Bx = 0.01 .* randn(Nx, Ny, Nz)
    By = ones(Nx, Ny, Nz)
    Bz = 0.01 .* randn(Nx, Ny, Nz)
    B = MagneticField(Bx, By, Bz)

    # Shear flow vx = V0 sin(2π z / Lz)
    vx = zeros(Nx, Ny, Nz)
    vy = zeros(Nx, Ny, Nz)
    vz = zeros(Nx, Ny, Nz)
    V0 = 1.0
    @inbounds for i in 1:Nx, j in 1:Ny, k in 1:Nz
        z = (k-1) * p.dx
        Lz = Nz * p.dx
        vx[i,j,k] = V0 * sin(2π * z / Lz)
    end
    v = VelocityField(vx, vy, vz)

    return Fields(phi, B, v)
end

##############################
# Driver                     #
##############################

function run_coupled!(p::Params)
    lat    = make_lattice(p)
    fields = init_fields(p, lat)

    for step in 1:p.nsteps
        update_phi!(fields.phi, fields.B, lat, p)
        update_B!(fields.B, fields.v, fields.phi, lat, p)
        boundary_layer_correction!(fields.B, lat, p)

        if step % p.log_interval == 0
            d = div(fields.B, lat)
            magE = sum(fields.B.Bx.^2 .+ fields.B.By.^2 .+ fields.B.Bz.^2)
            println("Step $step | divB = ", norm(d), " | Emag = ", magE)
        end
    end
end

##############################
# Entry point                #
##############################

p = Params(
    64, 64, 64, 1.0,      # Nx, Ny, Nz, dx
    0.01,                 # dt
    10_000,               # nsteps
    100,                  # log_interval
    -1.0, 1.0, 0.5, 0.2,  # a, b, κ, γ
    1.0,                  # Γ
    0.1, 0.5,             # η0, η1
    0.1                   # α
)

run_coupled!(p)